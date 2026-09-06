import { Router, Request, Response } from 'express';
import { dbManager } from '../../database/db';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth';

const router = Router();

// GET all suppliers with financial totals
router.get('/', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const suppliers = dbManager.all<any>('SELECT * FROM suppliers ORDER BY balance_due DESC');
    const totalPayable = suppliers.reduce((sum, s) => sum + Number(s.balance_due), 0);

    // Attach recent restock logs for each supplier
    const fullSuppliers = suppliers.map((sup) => {
      const restocks = dbManager.all<any>(
        'SELECT * FROM inventory_restock_logs WHERE supplier_id = ? ORDER BY date DESC LIMIT 5',
        sup.id
      );
      return { ...sup, restocks };
    });

    res.json({
      success: true,
      count: fullSuppliers.length,
      totalPayable,
      data: fullSuppliers
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new supplier
router.post('/', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { name, companyName, phone, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Supplier name and phone are required' });
    }

    const insertResult = dbManager.run(
      `INSERT INTO suppliers (name, company_name, phone, address, total_purchased, total_paid, balance_due)
       VALUES (?, ?, ?, ?, 0, 0, 0)`,
      name, companyName || null, phone, address || null
    );

    const created = dbManager.get<any>('SELECT * FROM suppliers WHERE id = ?', insertResult.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Supplier added successfully', data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST pay supplier
router.post('/payment', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { supplierId, amount, paymentMethod = 'Bank/bKash', notes } = req.body;

    if (!supplierId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid supplierId and positive amount are required' });
    }

    const supplier = dbManager.get<any>('SELECT * FROM suppliers WHERE id = ?', supplierId);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const payAmount = Number(amount);
    const newTotalPaid = Number(supplier.total_paid) + payAmount;
    const newBalanceDue = Math.max(0, Number(supplier.balance_due) - payAmount);

    dbManager.transaction(() => {
      // 1. Update supplier balance
      dbManager.run(
        `UPDATE suppliers SET
          total_paid = ?,
          balance_due = ?
         WHERE id = ?`,
        newTotalPaid,
        newBalanceDue,
        supplierId
      );

      // 2. Also optionally record as an expense if paid from drawer
      if (paymentMethod === 'Shop Drawer Cash') {
        dbManager.run(
          `INSERT INTO expenses (date, title, amount, category, payment_source, notes, created_by)
           VALUES (date('now'), ?, ?, 'Supplier Bill', 'Shop Drawer Cash', ?, 'Admin')`,
          `Supplier Payment - ${supplier.company_name || supplier.name}`,
          payAmount,
          notes || null
        );
      }
    });

    const updated = dbManager.get<any>('SELECT * FROM suppliers WHERE id = ?', supplierId);

    res.json({
      success: true,
      message: `Payment of ৳${payAmount} to ${supplier.name} recorded. Remaining balance: ৳${newBalanceDue}`,
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
