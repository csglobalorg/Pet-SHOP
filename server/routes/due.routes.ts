import { Router, Request, Response } from 'express';
import { dbManager } from '../../database/db';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth';

const router = Router();

// GET all customer dues
router.get('/', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    let query = 'SELECT * FROM customer_dues WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (customer_name LIKE ? OR customer_phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
    }

    query += ' ORDER BY total_due DESC';

    const dues = dbManager.all<any>(query, ...params);
    const totalDueOutstanding = dues.reduce((sum, d) => sum + Number(d.total_due), 0);

    // Attach last 5 logs for each due customer
    const fullDues = dues.map((due) => {
      const logs = dbManager.all<any>(
        'SELECT * FROM customer_due_logs WHERE customer_due_id = ? ORDER BY date DESC LIMIT 5',
        due.id
      );
      return { ...due, logs };
    });

    res.json({
      success: true,
      count: fullDues.length,
      totalDueOutstanding,
      data: fullDues
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST record customer due payment
router.post('/payment', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { customerDueId, amount, paymentMethod = 'CASH', notes } = req.body;

    if (!customerDueId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid customerDueId and positive amount are required' });
    }

    const dueRecord = dbManager.get<any>('SELECT * FROM customer_dues WHERE id = ?', customerDueId);
    if (!dueRecord) {
      return res.status(404).json({ success: false, message: 'Customer due record not found' });
    }

    const payAmount = Number(amount);
    const newTotalDue = Math.max(0, Number(dueRecord.total_due) - payAmount);

    dbManager.transaction(() => {
      // 1. Update customer_dues
      dbManager.run(
        `UPDATE customer_dues SET
          total_due = ?,
          last_payment_date = date('now')
         WHERE id = ?`,
        newTotalDue,
        customerDueId
      );

      // 2. Insert into customer_due_logs
      dbManager.run(
        `INSERT INTO customer_due_logs (customer_due_id, type, amount, payment_method, notes)
         VALUES (?, 'PAYMENT_RECEIVED', ?, ?, ?)`,
        customerDueId,
        payAmount,
        paymentMethod,
        notes || `Payment received from ${dueRecord.customer_name}`
      );
    });

    const updated = dbManager.get<any>('SELECT * FROM customer_dues WHERE id = ?', customerDueId);
    const logs = dbManager.all<any>(
      'SELECT * FROM customer_due_logs WHERE customer_due_id = ? ORDER BY date DESC LIMIT 5',
      customerDueId
    );

    res.json({
      success: true,
      message: `Payment of ৳${payAmount} recorded successfully. Remaining due: ৳${newTotalDue}`,
      data: { ...updated, logs }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
