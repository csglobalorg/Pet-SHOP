import { Router, Request, Response } from 'express';
import { dbManager } from '../../database/db';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth';

const router = Router();

// GET Analytics Overview
router.get('/overview', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7); // 'YYYY-MM'

    // 1. Today's Revenue
    const todaySalesRow = dbManager.get<any>(
      `SELECT
         COALESCE(SUM(total_amount), 0) as todayRevenue,
         COUNT(id) as todayOrderCount
       FROM orders
       WHERE date(created_at) = ? AND order_status != 'CANCELLED'`,
      today
    );
    const todayRevenue = Number(todaySalesRow?.todayRevenue || 0);
    const todayOrders = Number(todaySalesRow?.todayOrderCount || 0);

    // 2. Today's Cost of Goods Sold (COGS)
    const todayCogsRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(oi.cost_price * oi.quantity), 0) as todayCogs
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE date(o.created_at) = ? AND o.order_status != 'CANCELLED'`,
      today
    );
    const todayCogs = Number(todayCogsRow?.todayCogs || 0);

    // 3. Today's Expenses
    const todayExpenseRow = dbManager.get<any>(
      `SELECT COALESCE(SUM(amount), 0) as todayExpenses
       FROM expenses
       WHERE date(date) = ?`,
      today
    );
    const todayExpenses = Number(todayExpenseRow?.todayExpenses || 0);

    // 4. Today's Estimated Net Profit
    const todayGrossProfit = todayRevenue - todayCogs;
    const todayNetProfit = todayGrossProfit - todayExpenses;

    // 5. Month-to-date Revenue
    const monthSalesRow = dbManager.get<any>(
      `SELECT
         COALESCE(SUM(total_amount), 0) as monthRevenue,
         COUNT(id) as monthOrderCount
       FROM orders
       WHERE strftime('%Y-%m', created_at) = ? AND order_status != 'CANCELLED'`,
      currentMonth
    );
    const monthRevenue = Number(monthSalesRow?.monthRevenue || 0);
    const monthOrders = Number(monthSalesRow?.monthOrderCount || 0);

    // 6. Top Selling Products
    const topProducts = dbManager.all<any>(
      `SELECT
         oi.product_id,
         oi.product_name,
         SUM(oi.quantity) as totalSoldQuantity,
         SUM(oi.total_price) as totalSalesValue
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.order_status != 'CANCELLED'
       GROUP BY oi.product_id, oi.product_name
       ORDER BY totalSoldQuantity DESC
       LIMIT 5`
    );

    // 7. Low Stock Alerts
    const lowStockProducts = dbManager.all<any>(
      `SELECT id, name, category, pet_type, stock_quantity, low_stock_threshold, price
       FROM products
       WHERE stock_quantity <= low_stock_threshold
       ORDER BY stock_quantity ASC`
    );

    // 8. Order breakdown (POS vs Online)
    const orderBreakdown = dbManager.all<any>(
      `SELECT
         order_source,
         COUNT(id) as count,
         COALESCE(SUM(total_amount), 0) as revenue
       FROM orders
       WHERE order_status != 'CANCELLED'
       GROUP BY order_source`
    );

    res.json({
      success: true,
      data: {
        date: today,
        month: currentMonth,
        today: {
          revenue: todayRevenue,
          cogs: todayCogs,
          grossProfit: todayGrossProfit,
          expenses: todayExpenses,
          netProfit: todayNetProfit,
          orders: todayOrders
        },
        monthToDate: {
          revenue: monthRevenue,
          orders: monthOrders
        },
        topSellingProducts: topProducts,
        lowStockAlerts: {
          count: lowStockProducts.length,
          products: lowStockProducts
        },
        salesBySource: orderBreakdown
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
