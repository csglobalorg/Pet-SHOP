import { Router, Request, Response } from 'express';
import { dbManager } from '../../database/db';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth';
import { format80mmThermalReceipt } from '../utils/thermalReceipt';

const router = Router();

// 1. POS Counter Sale (Atomic Stock Deduction + Dokan Due / Cash Drawer Integration)
router.post('/pos-sale', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      paymentMethod, // 'CASH', 'BKASH', 'NAGAD', 'CARD', 'DUE'
      trxId,
      subtotal,
      discountAmount = 0,
      tenderedCash,
      cashierName = 'Staff Cashier',
      items // Array of { productId, quantity, unitPrice, costPrice, name }
    } = req.body;

    if (!customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer phone and at least one item are required for POS sale'
      });
    }

    const netSubtotal = Number(subtotal);
    const netDiscount = Number(discountAmount || 0);
    const totalAmount = Math.max(0, netSubtotal - netDiscount);
    const tendered = tenderedCash !== undefined ? Number(tenderedCash) : totalAmount;
    const changeReturned = Math.max(0, tendered - totalAmount);

    const orderId = 'CBZ-POS-' + Date.now().toString().slice(-6);

    // ATOMIC DATABASE TRANSACTION
    const result = dbManager.transaction(() => {
      // Step A: Check and deduct stock for each item atomically
      for (const item of items) {
        const product = dbManager.get<any>(
          'SELECT id, name, stock_quantity, price, cost_price FROM products WHERE id = ?',
          item.productId
        );

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.name}". Available: ${product.stock_quantity}, Requested: ${item.quantity}`
          );
        }

        // Atomic decrement
        dbManager.run(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          item.quantity,
          item.productId
        );
      }

      // Step B: Insert into orders table
      dbManager.run(
        `INSERT INTO orders (
          id, order_source, customer_id, customer_name, customer_phone,
          delivery_address, delivery_area, payment_method, payment_status,
          trx_id, subtotal, delivery_charge, discount_amount, total_amount,
          tendered_cash, change_returned, order_status, cashier_name
        ) VALUES (?, 'POS', ?, ?, ?, 'Shop Counter Pick-Up', 'Cox''s Bazar Counter', ?, ?, ?, ?, 0, ?, ?, ?, ?, 'DELIVERED', ?)`,
        orderId,
        customerId || null,
        customerName || 'Walk-in Customer',
        customerPhone,
        paymentMethod,
        paymentMethod === 'DUE' ? 'PENDING' : 'PAID',
        trxId || null,
        netSubtotal,
        netDiscount,
        totalAmount,
        tendered,
        changeReturned,
        cashierName
      );

      // Step C: Insert order_items
      const receiptItems: any[] = [];
      for (const item of items) {
        const itemTotal = Number(item.unitPrice) * Number(item.quantity);
        dbManager.run(
          `INSERT INTO order_items (order_id, product_id, product_name, unit_price, cost_price, quantity, total_price)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          orderId,
          item.productId,
          item.name || item.productName || item.productId,
          Number(item.unitPrice),
          Number(item.costPrice || item.unitPrice * 0.75),
          Number(item.quantity),
          itemTotal
        );

        receiptItems.push({
          name: item.name || item.productName || item.productId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: itemTotal
        });
      }

      // Step D: If payment method is 'DUE', record in Bakir Khata (customer_dues & logs)
      if (paymentMethod === 'DUE') {
        let dueRecord = dbManager.get<any>(
          'SELECT id, total_due FROM customer_dues WHERE customer_phone = ?',
          customerPhone
        );

        let dueId: number;
        if (!dueRecord) {
          const insertRes = dbManager.run(
            `INSERT INTO customer_dues (customer_name, customer_phone, total_due, last_payment_date, notes)
             VALUES (?, ?, ?, date('now'), 'POS Counter Due Sale')`,
            customerName || 'Walk-in Customer',
            customerPhone,
            totalAmount
          );
          dueId = Number(insertRes.lastInsertRowid);
        } else {
          dueId = dueRecord.id;
          dbManager.run(
            `UPDATE customer_dues SET total_due = total_due + ?, last_payment_date = date('now') WHERE id = ?`,
            totalAmount,
            dueId
          );
        }

        // Insert log
        dbManager.run(
          `INSERT INTO customer_due_logs (customer_due_id, order_id, type, amount, payment_method, notes)
           VALUES (?, ?, 'NEW_DUE', ?, 'DUE', 'POS Counter Sale')`,
          dueId,
          orderId,
          totalAmount
        );
      }

      return {
        orderId,
        totalAmount,
        receiptItems,
        createdAt: new Date().toISOString()
      };
    });

    // Format 80mm thermal receipt
    const thermalReceiptText = format80mmThermalReceipt({
      orderId: result.orderId,
      orderSource: 'POS COUNTER',
      cashierName,
      customerName: customerName || 'Walk-in Customer',
      customerPhone,
      paymentMethod,
      subtotal: netSubtotal,
      deliveryCharge: 0,
      discountAmount: netDiscount,
      totalAmount,
      tenderedCash: tendered,
      changeReturned,
      items: result.receiptItems,
      createdAt: result.createdAt
    });

    res.status(201).json({
      success: true,
      message: 'POS sale processed successfully with atomic stock deduction',
      data: {
        orderId: result.orderId,
        totalAmount,
        changeReturned,
        thermalReceipt: thermalReceiptText
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 2. Online Customer Checkout
router.post('/checkout', (req: Request, res: Response) => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryArea,
      paymentMethod, // 'CASH', 'BKASH', 'NAGAD'
      trxId,
      subtotal,
      deliveryCharge = 60,
      discountAmount = 0,
      items
    } = req.body;

    if (!customerName || !customerPhone || !deliveryAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, delivery address, and cart items are required'
      });
    }

    const netSubtotal = Number(subtotal);
    const netDelivery = Number(deliveryCharge);
    const netDiscount = Number(discountAmount);
    const totalAmount = Math.max(0, netSubtotal + netDelivery - netDiscount);
    const orderId = 'CBZ-WEB-' + Date.now().toString().slice(-6);

    const result = dbManager.transaction(() => {
      // Validate and deduct stock
      for (const item of items) {
        const product = dbManager.get<any>(
          'SELECT id, name, stock_quantity, price FROM products WHERE id = ?',
          item.productId
        );

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock_quantity}`);
        }

        dbManager.run(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          item.quantity,
          item.productId
        );
      }

      // Create order
      dbManager.run(
        `INSERT INTO orders (
          id, order_source, customer_id, customer_name, customer_phone,
          delivery_address, delivery_area, payment_method, payment_status,
          trx_id, subtotal, delivery_charge, discount_amount, total_amount,
          order_status, cashier_name
        ) VALUES (?, 'ONLINE', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'Web Storefront')`,
        orderId,
        customerId || null,
        customerName,
        customerPhone,
        deliveryAddress,
        deliveryArea || "Cox's Bazar Sadar",
        paymentMethod || 'CASH',
        paymentMethod === 'CASH' ? 'PENDING' : (trxId ? 'PAID' : 'PENDING'),
        trxId || null,
        netSubtotal,
        netDelivery,
        netDiscount,
        totalAmount
      );

      // Insert items
      for (const item of items) {
        const itemTotal = Number(item.unitPrice) * Number(item.quantity);
        dbManager.run(
          `INSERT INTO order_items (order_id, product_id, product_name, unit_price, cost_price, quantity, total_price)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          orderId,
          item.productId,
          item.name || item.title || item.productId,
          Number(item.unitPrice || item.price),
          Number(item.costPrice || (item.unitPrice || item.price) * 0.75),
          Number(item.quantity),
          itemTotal
        );
      }

      return { orderId, totalAmount };
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! We will contact you for delivery confirmation.',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 3. Track Order (Public by order ID or phone)
router.get('/track/:query', (req: Request, res: Response) => {
  try {
    const { query } = req.params;

    const orders = dbManager.all<any>(
      `SELECT * FROM orders WHERE id = ? OR customer_phone = ? ORDER BY created_at DESC`,
      query, query
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found matching this order ID or phone number' });
    }

    // Attach items
    const fullOrders = orders.map((order) => {
      const items = dbManager.all<any>('SELECT * FROM order_items WHERE order_id = ?', order.id);
      return { ...order, items };
    });

    res.json({ success: true, count: fullOrders.length, data: fullOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. GET all orders with filters (Admin / Staff)
router.get('/', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { date, orderSource, status, paymentStatus, search } = req.query;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];

    if (date) {
      query += ' AND date(created_at) = ?';
      params.push(date);
    }

    if (orderSource) {
      query += ' AND order_source = ?';
      params.push(orderSource);
    }

    if (status) {
      query += ' AND order_status = ?';
      params.push(status);
    }

    if (paymentStatus) {
      query += ' AND payment_status = ?';
      params.push(paymentStatus);
    }

    if (search) {
      query += ' AND (id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY created_at DESC';

    const orders = dbManager.all<any>(query, ...params);

    // Attach order items
    const fullOrders = orders.map((o) => {
      const items = dbManager.all<any>('SELECT * FROM order_items WHERE order_id = ?', o.id);
      return { ...o, items };
    });

    res.json({ success: true, count: fullOrders.length, data: fullOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Update Order Status (With stock restoration if cancelled)
router.patch('/:id/status', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = dbManager.get<any>('SELECT * FROM orders WHERE id = ?', id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    dbManager.transaction(() => {
      // If cancelling an active order, restore stocks
      if (orderStatus === 'CANCELLED' && order.order_status !== 'CANCELLED') {
        const items = dbManager.all<any>('SELECT * FROM order_items WHERE order_id = ?', id);
        for (const item of items) {
          dbManager.run(
            'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
            item.quantity,
            item.product_id
          );
        }
      }

      dbManager.run(
        `UPDATE orders SET
          order_status = COALESCE(?, order_status),
          payment_status = COALESCE(?, payment_status)
         WHERE id = ?`,
        orderStatus || null,
        paymentStatus || null,
        id
      );
    });

    const updated = dbManager.get<any>('SELECT * FROM orders WHERE id = ?', id);
    res.json({ success: true, message: 'Order status updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Thermal Receipt Generator endpoint
router.get('/:id/receipt', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = dbManager.get<any>('SELECT * FROM orders WHERE id = ?', id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const items = dbManager.all<any>('SELECT * FROM order_items WHERE order_id = ?', id);
    const receiptItems = items.map((it) => ({
      name: it.product_name,
      quantity: it.quantity,
      unitPrice: it.unit_price,
      totalPrice: it.total_price
    }));

    const receiptText = format80mmThermalReceipt({
      orderId: order.id,
      orderSource: order.order_source,
      cashierName: order.cashier_name,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      paymentMethod: order.payment_method,
      subtotal: order.subtotal,
      deliveryCharge: order.delivery_charge,
      discountAmount: order.discount_amount,
      totalAmount: order.total_amount,
      tenderedCash: order.tendered_cash,
      changeReturned: order.change_returned,
      items: receiptItems,
      createdAt: order.created_at
    });

    res.json({
      success: true,
      data: {
        order,
        items,
        thermalReceiptText: receiptText
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
