import { Router, Request, Response } from 'express';
import { dbManager } from '../../database/db';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth';

const router = Router();

// GET expenses with filters
router.get('/', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { month, date, category, paymentSource } = req.query;

    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params: any[] = [];

    if (date) {
      query += ' AND date(date) = ?';
      params.push(date);
    } else if (month) {
      // e.g. month=2026-09
      query += " AND strftime('%Y-%m', date) = ?";
      params.push(month);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (paymentSource) {
      query += ' AND payment_source = ?';
      params.push(paymentSource);
    }

    query += ' ORDER BY date DESC, id DESC';

    const expenses = dbManager.all<any>(query, ...params);
    const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    res.json({
      success: true,
      count: expenses.length,
      totalAmount,
      data: expenses
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new expense
router.post('/', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { title, amount, category, paymentSource, notes, receiptUrl, date, createdBy } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ success: false, message: 'Title, amount and category are required' });
    }

    const expenseDate = date || new Date().toISOString().split('T')[0];
    const source = paymentSource || 'Shop Drawer Cash';

    const insertResult = dbManager.run(
      `INSERT INTO expenses (date, title, amount, category, payment_source, notes, receipt_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      expenseDate,
      title,
      Number(amount),
      category,
      source,
      notes || null,
      receiptUrl || null,
      createdBy || 'Staff'
    );

    const created = dbManager.get<any>('SELECT * FROM expenses WHERE id = ?', insertResult.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Expense added to shop khata',
      data: created
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE expense
router.delete('/:id', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = dbManager.get('SELECT id FROM expenses WHERE id = ?', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    dbManager.run('DELETE FROM expenses WHERE id = ?', id);
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
