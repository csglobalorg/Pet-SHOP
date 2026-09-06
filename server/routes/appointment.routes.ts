import { Router, Request, Response } from 'express';
import { dbManager } from '../../database/db';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth';

const router = Router();

// POST new appointment booking (Public / Customer)
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      petName,
      petType,
      petBreed,
      ownerName,
      ownerPhone,
      serviceType,
      preferredDate,
      timeSlot,
      notes
    } = req.body;

    if (!petName || !ownerName || !ownerPhone || !serviceType || !preferredDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Pet name, owner name, phone, service type, preferred date and time slot are required'
      });
    }

    const id = 'APT-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);

    dbManager.run(
      `INSERT INTO appointments (
        id, pet_name, pet_type, pet_breed, owner_name,
        owner_phone, service_type, preferred_date, time_slot,
        status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
      id,
      petName,
      petType || 'Cat',
      petBreed || null,
      ownerName,
      ownerPhone,
      serviceType,
      preferredDate,
      timeSlot,
      notes || null
    );

    const created = dbManager.get<any>('SELECT * FROM appointments WHERE id = ?', id);

    res.status(201).json({
      success: true,
      message: 'Care appointment booked successfully! We will call you to confirm your time slot.',
      data: created
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET appointments (Admin Calendar / Customer Tracker)
router.get('/', (req: Request, res: Response) => {
  try {
    const { date, status, phone } = req.query;

    let query = 'SELECT * FROM appointments WHERE 1=1';
    const params: any[] = [];

    if (date) {
      query += ' AND preferred_date = ?';
      params.push(date);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (phone) {
      query += ' AND owner_phone = ?';
      params.push(phone);
    }

    query += ' ORDER BY preferred_date ASC, time_slot ASC';

    const appointments = dbManager.all<any>(query, ...params);
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH appointment status (Admin / Staff)
router.patch('/:id/status', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const appointment = dbManager.get<any>('SELECT * FROM appointments WHERE id = ?', id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    dbManager.run(
      `UPDATE appointments SET
        status = ?,
        notes = COALESCE(?, notes)
       WHERE id = ?`,
      status,
      notes || null,
      id
    );

    const updated = dbManager.get<any>('SELECT * FROM appointments WHERE id = ?', id);
    res.json({
      success: true,
      message: `Appointment status changed to ${status}`,
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
