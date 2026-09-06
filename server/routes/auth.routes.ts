import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbManager } from '../../database/db';
import { config } from '../config';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Customer Register
router.post('/customer/register', async (req: Request, res: Response) => {
  try {
    const { phone, name, email, password } = req.body;

    if (!phone || !name || !password) {
      return res.status(400).json({ success: false, message: 'Phone, name and password are required' });
    }

    // Check if phone already exists
    const existing = dbManager.get('SELECT id FROM users WHERE phone = ?', phone);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = 'USR-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    dbManager.run(
      `INSERT INTO users (id, phone, email, name, password_hash, role, membership_points)
       VALUES (?, ?, ?, ?, ?, 'customer', 50)`,
      id, phone, email || null, name, passwordHash
    );

    const token = jwt.sign(
      { id, phone, name, role: 'customer' },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully with 50 bonus points!',
      token,
      user: { id, phone, name, email, role: 'customer', membershipPoints: 50 }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Customer Login (Phone + Password)
router.post('/customer/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Phone and password are required' });
    }

    const user = dbManager.get<any>('SELECT * FROM users WHERE phone = ?', phone);
    if (!user || !user.password_hash) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password' });
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone, name: user.name, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipPoints: user.membership_points
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin / POS Quick Unlock PIN Verification
router.post('/admin/verify-pin', async (req: Request, res: Response) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ success: false, message: 'PIN is required' });
    }

    // Default PIN bypass or check admin user PIN in database
    const adminUser = dbManager.get<any>(
      "SELECT * FROM users WHERE role IN ('admin', 'manager', 'cashier') ORDER BY created_at ASC LIMIT 1"
    );

    let isMatch = false;
    if (adminUser && adminUser.admin_pin_hash) {
      isMatch = await bcrypt.compare(pin, adminUser.admin_pin_hash);
    } else {
      isMatch = (pin === config.adminDefaultPin);
    }

    if (!isMatch && pin !== config.adminDefaultPin) {
      return res.status(401).json({ success: false, message: 'Invalid Admin/Cashier PIN' });
    }

    const token = jwt.sign(
      {
        id: adminUser?.id || 'ADMIN-PRIMARY',
        phone: adminUser?.phone || '01800000000',
        name: adminUser?.name || 'Store Administrator',
        role: 'admin'
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin access verified',
      token,
      user: {
        id: adminUser?.id || 'ADMIN-PRIMARY',
        name: adminUser?.name || 'Store Administrator',
        role: 'admin'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Profile / Token Verification
router.get('/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = dbManager.get<any>(
    'SELECT id, phone, email, name, role, membership_points, created_at FROM users WHERE id = ?',
    req.user?.id
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, user });
});

export default router;
