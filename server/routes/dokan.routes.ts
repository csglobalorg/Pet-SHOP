import { Router, Request, Response } from 'express';
import { dbManager } from '../../database/db';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth';

const router = Router();

// GET today's cash register & drawer float overview
router.get('/today', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Get or create today's cash register
    let register = dbManager.get<any>('SELECT * FROM cash_registers WHERE date = ?', today);
    const openingCash = register ? Number(register.opening_cash) : 0;

    // 2. Total cash sales from today's POS counter orders
    const cashSalesRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(total_amount), 0) as totalCash
       FROM orders
       WHERE date(created_at) = ? AND payment_method = 'CASH' AND order_status != 'CANCELLED'`,
      today
    );
    const totalCashSales = Number(cashSalesRow?.totalCash || 0);

    // 3. Total digital sales today (bKash, Nagad, Card)
    const digitalSalesRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(total_amount), 0) as totalDigital
       FROM orders
       WHERE date(created_at) = ? AND payment_method IN ('BKASH', 'NAGAD', 'CARD') AND order_status != 'CANCELLED'`,
      today
    );
    const totalDigitalSales = Number(digitalSalesRow?.totalDigital || 0);

    // 4. Total dues given today
    const dueSalesRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(total_amount), 0) as totalDue
       FROM orders
       WHERE date(created_at) = ? AND payment_method = 'DUE' AND order_status != 'CANCELLED'`,
      today
    );
    const totalDueSales = Number(dueSalesRow?.totalDue || 0);

    // 5. Total expenses paid from drawer cash today
    const cashExpenseRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(amount), 0) as totalCashExpense
       FROM expenses
       WHERE date(date) = ? AND payment_source = 'Shop Drawer Cash'`,
      today
    );
    const totalCashExpenses = Number(cashExpenseRow?.totalCashExpense || 0);

    // 6. Total due payments collected in cash today
    const dueCollectionRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(amount), 0) as dueCashCollected
       FROM customer_due_logs
       WHERE date(date) = ? AND type = 'PAYMENT_RECEIVED' AND payment_method = 'CASH'`,
      today
    );
    const totalDueCashCollected = Number(dueCollectionRow?.dueCashCollected || 0);

    // Formula:
    // Expected Drawer Cash = Opening Cash + Cash Sales + Due Cash Collected - Drawer Cash Expenses
    const expectedDrawerCash = openingCash + totalCashSales + totalDueCashCollected - totalCashExpenses;

    res.json({
      success: true,
      data: {
        date: today,
        register: register || {
          date: today,
          opening_cash: 0,
          is_closed: false,
          status: 'UNSET'
        },
        financials: {
          openingCash,
          todayCashSales: totalCashSales,
          todayDigitalSales: totalDigitalSales,
          todayDueSales: totalDueSales,
          totalRevenue: totalCashSales + totalDigitalSales,
          dueCashCollected: totalDueCashCollected,
          drawerExpensesPaid: totalCashExpenses,
          expectedDrawerCash: Math.max(0, expectedDrawerCash)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST set morning opening cash
router.post('/opening-cash', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { amount, notes, date, openedBy } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (amount === undefined || Number(amount) < 0) {
      return res.status(400).json({ success: false, message: 'Valid non-negative opening cash amount is required' });
    }

    const existing = dbManager.get<any>('SELECT * FROM cash_registers WHERE date = ?', targetDate);

    if (existing) {
      dbManager.run(
        `UPDATE cash_registers SET
          opening_cash = ?,
          opening_notes = COALESCE(?, opening_notes),
          opened_by = COALESCE(?, opened_by)
         WHERE date = ?`,
        Number(amount),
        notes || null,
        openedBy || 'Staff',
        targetDate
      );
    } else {
      dbManager.run(
        `INSERT INTO cash_registers (date, opening_cash, opening_notes, opened_by, is_closed)
         VALUES (?, ?, ?, ?, 0)`,
        targetDate,
        Number(amount),
        notes || null,
        openedBy || 'Staff'
      );
    }

    const updated = dbManager.get<any>('SELECT * FROM cash_registers WHERE date = ?', targetDate);
    res.json({
      success: true,
      message: `Morning opening cash of ৳${amount} recorded for ${targetDate}`,
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST evening close register & cash reconciliation
router.post('/close-register', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { closingCash, closedBy, notes, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (closingCash === undefined || Number(closingCash) < 0) {
      return res.status(400).json({ success: false, message: 'Actual counted closing cash amount is required' });
    }

    const register = dbManager.get<any>('SELECT * FROM cash_registers WHERE date = ?', targetDate);
    if (!register) {
      return res.status(400).json({ success: false, message: 'No opening cash record found for today' });
    }

    // Calculate expected cash to compute discrepancy
    const cashSalesRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(total_amount), 0) as totalCash
       FROM orders
       WHERE date(created_at) = ? AND payment_method = 'CASH' AND order_status != 'CANCELLED'`,
      targetDate
    );
    const cashExpenseRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(amount), 0) as totalCashExpense
       FROM expenses
       WHERE date(date) = ? AND payment_source = 'Shop Drawer Cash'`,
      targetDate
    );
    const dueCollectionRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(amount), 0) as dueCashCollected
       FROM customer_due_logs
       WHERE date(date) = ? AND type = 'PAYMENT_RECEIVED' AND payment_method = 'CASH'`,
      targetDate
    );

    const expectedCash =
      Number(register.opening_cash) +
      Number(cashSalesRow?.totalCash || 0) +
      Number(dueCollectionRow?.dueCashCollected || 0) -
      Number(cashExpenseRow?.totalCashExpense || 0);

    const discrepancy = Number(closingCash) - expectedCash;

    dbManager.run(
      `UPDATE cash_registers SET
        closing_cash = ?,
        is_closed = 1,
        closed_by = ?
       WHERE date = ?`,
      Number(closingCash),
      closedBy || 'Admin',
      targetDate
    );

    res.json({
      success: true,
      message: `Cash register closed for ${targetDate}`,
      data: {
        date: targetDate,
        openingCash: Number(register.opening_cash),
        countedClosingCash: Number(closingCash),
        expectedCash,
        discrepancy, // 0 = balanced, >0 = surplus, <0 = deficit
        status: discrepancy === 0 ? 'BALANCED' : discrepancy > 0 ? 'SURPLUS' : 'DEFICIT'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
