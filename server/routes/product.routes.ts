import { Router, Request, Response } from 'express';
import { dbManager } from '../../database/db';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth';

const router = Router();

// GET all products with filtering & search
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, petType, search, inStock, flashSale, sort } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (petType && petType !== 'all') {
      query += ' AND pet_type = ?';
      params.push(petType);
    }

    if (flashSale === 'true') {
      query += ' AND is_flash_sale = 1';
    }

    if (inStock === 'true') {
      query += ' AND stock_quantity > 0';
    }

    if (search) {
      query += ' AND (name LIKE ? OR name_bn LIKE ? OR brand LIKE ? OR id LIKE ? OR barcode = ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term, search);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'stock_asc':
        query += ' ORDER BY stock_quantity ASC';
        break;
      case 'newest':
      default:
        query += ' ORDER BY created_at DESC';
        break;
    }

    const products = dbManager.all<any>(query, ...params);
    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Barcode Lookup for POS scanner
router.get('/barcode/:barcode', (req: Request, res: Response) => {
  try {
    const { barcode } = req.params;
    const product = dbManager.get<any>('SELECT * FROM products WHERE barcode = ? OR id = ?', barcode, barcode);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found with this barcode' });
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single product by SKU / ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = dbManager.get<any>('SELECT * FROM products WHERE id = ?', id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new product (Admin / Staff)
router.post('/', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const {
      id, name, nameBn, category, petType, brand,
      price, costPrice, discountPrice, stockQuantity,
      lowStockThreshold, barcode, unit, weight,
      imageUrl, description, isFeatured, isFlashSale
    } = req.body;

    if (!id || !name || !category || !price) {
      return res.status(400).json({ success: false, message: 'SKU/ID, Name, Category and Price are required' });
    }

    const existing = dbManager.get('SELECT id FROM products WHERE id = ?', id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Product SKU/ID already exists' });
    }

    dbManager.run(
      `INSERT INTO products (
        id, name, name_bn, category, pet_type, brand,
        price, cost_price, discount_price, stock_quantity,
        low_stock_threshold, barcode, unit, weight,
        image_url, description, is_featured, is_flash_sale
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      name,
      nameBn || null,
      category,
      petType || 'Cat',
      brand || 'General',
      Number(price),
      Number(costPrice || price * 0.75),
      discountPrice ? Number(discountPrice) : null,
      Number(stockQuantity || 0),
      Number(lowStockThreshold || 5),
      barcode || id,
      unit || 'Piece',
      weight || null,
      imageUrl || null,
      description || null,
      isFeatured ? 1 : 0,
      isFlashSale ? 1 : 0
    );

    const created = dbManager.get('SELECT * FROM products WHERE id = ?', id);
    res.status(201).json({ success: true, message: 'Product created successfully', data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update product
router.put('/:id', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = dbManager.get<any>('SELECT * FROM products WHERE id = ?', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name, nameBn, category, petType, brand,
      price, costPrice, discountPrice, stockQuantity,
      lowStockThreshold, barcode, unit, weight,
      imageUrl, description, isFeatured, isFlashSale
    } = req.body;

    dbManager.run(
      `UPDATE products SET
        name = COALESCE(?, name),
        name_bn = COALESCE(?, name_bn),
        category = COALESCE(?, category),
        pet_type = COALESCE(?, pet_type),
        brand = COALESCE(?, brand),
        price = COALESCE(?, price),
        cost_price = COALESCE(?, cost_price),
        discount_price = ?,
        stock_quantity = COALESCE(?, stock_quantity),
        low_stock_threshold = COALESCE(?, low_stock_threshold),
        barcode = COALESCE(?, barcode),
        unit = COALESCE(?, unit),
        weight = COALESCE(?, weight),
        image_url = COALESCE(?, image_url),
        description = COALESCE(?, description),
        is_featured = COALESCE(?, is_featured),
        is_flash_sale = COALESCE(?, is_flash_sale)
       WHERE id = ?`,
      name ?? null,
      nameBn ?? null,
      category ?? null,
      petType ?? null,
      brand ?? null,
      price !== undefined ? Number(price) : null,
      costPrice !== undefined ? Number(costPrice) : null,
      discountPrice !== undefined ? Number(discountPrice) : null,
      stockQuantity !== undefined ? Number(stockQuantity) : null,
      lowStockThreshold !== undefined ? Number(lowStockThreshold) : null,
      barcode ?? null,
      unit ?? null,
      weight ?? null,
      imageUrl ?? null,
      description ?? null,
      isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
      isFlashSale !== undefined ? (isFlashSale ? 1 : 0) : null,
      id
    );

    const updated = dbManager.get('SELECT * FROM products WHERE id = ?', id);
    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE product
router.delete('/:id', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = dbManager.get('SELECT id FROM products WHERE id = ?', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    dbManager.run('DELETE FROM products WHERE id = ?', id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST restock inventory (Atomic stock increment + Supplier ledger restock log)
router.post('/restock', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { productId, quantityAdded, unitCost, supplierId, invoiceNumber } = req.body;

    if (!productId || !quantityAdded || quantityAdded <= 0) {
      return res.status(400).json({ success: false, message: 'Valid productId and positive quantityAdded are required' });
    }

    const product = dbManager.get<any>('SELECT * FROM products WHERE id = ?', productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const totalCost = (Number(unitCost) || Number(product.cost_price)) * Number(quantityAdded);

    // Atomic transaction for restock
    const result = dbManager.transaction(() => {
      // 1. Update product stock and optionally cost price
      dbManager.run(
        `UPDATE products SET
          stock_quantity = stock_quantity + ?,
          cost_price = COALESCE(?, cost_price)
         WHERE id = ?`,
        Number(quantityAdded),
        unitCost ? Number(unitCost) : null,
        productId
      );

      // 2. Insert into inventory_restock_logs
      dbManager.run(
        `INSERT INTO inventory_restock_logs (supplier_id, product_id, quantity_added, unit_cost, total_cost, invoice_number)
         VALUES (?, ?, ?, ?, ?, ?)`,
        supplierId || null,
        productId,
        Number(quantityAdded),
        unitCost ? Number(unitCost) : product.cost_price,
        totalCost,
        invoiceNumber || null
      );

      // 3. If supplierId provided, update supplier ledger
      if (supplierId) {
        dbManager.run(
          `UPDATE suppliers SET
            total_purchased = total_purchased + ?,
            balance_due = balance_due + ?
           WHERE id = ?`,
          totalCost,
          totalCost,
          supplierId
        );
      }

      const updatedProduct = dbManager.get<any>('SELECT * FROM products WHERE id = ?', productId);
      return { updatedProduct, totalCost };
    });

    res.json({
      success: true,
      message: `Successfully restocked ${quantityAdded} units of ${product.name}`,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
