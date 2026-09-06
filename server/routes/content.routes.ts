import { Router, Request, Response } from 'express';
import { dbManager } from '../../database/db';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth';

const router = Router();

// =================== PET LISTINGS ===================

// GET all pet listings (Adoption & Sale)
router.get('/pets', (req: Request, res: Response) => {
  try {
    const { petType, isAdoption, available } = req.query;

    let query = 'SELECT * FROM pet_listings WHERE 1=1';
    const params: any[] = [];

    if (petType && petType !== 'all') {
      query += ' AND pet_type = ?';
      params.push(petType);
    }

    if (isAdoption === 'true') {
      query += ' AND is_adoption = 1';
    }

    if (available !== undefined) {
      query += ' AND is_available = ?';
      params.push(available === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';

    const pets = dbManager.all<any>(query, ...params);
    res.json({ success: true, count: pets.length, data: pets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new pet listing (Admin)
router.post('/pets', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const {
      name, breed, petType, age, gender, price,
      isAdoption, imageUrl, vaccinated, dewormed,
      healthPassport, description, location
    } = req.body;

    if (!name || !breed || !petType) {
      return res.status(400).json({ success: false, message: 'Pet name, breed and petType are required' });
    }

    const id = 'PET-' + Date.now().toString(36);

    dbManager.run(
      `INSERT INTO pet_listings (
        id, name, breed, pet_type, age, gender, price,
        is_adoption, image_url, vaccinated, dewormed,
        health_passport, description, is_available, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      id,
      name,
      breed,
      petType,
      age || 'Young',
      gender || 'Male',
      Number(price || 0),
      isAdoption ? 1 : 0,
      imageUrl || null,
      vaccinated ? 1 : 0,
      dewormed ? 1 : 0,
      healthPassport ? 1 : 0,
      description || null,
      location || "Cox's Bazar"
    );

    const created = dbManager.get<any>('SELECT * FROM pet_listings WHERE id = ?', id);
    res.status(201).json({ success: true, message: 'Pet listing created', data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =================== BLOG POSTS ===================

// GET all blog posts
router.get('/blogs', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    let query = 'SELECT * FROM blog_posts WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR title_bn LIKE ? OR excerpt LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY created_at DESC';

    const blogs = dbManager.all<any>(query, ...params);
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new blog post (Admin)
router.post('/blogs', authenticateToken, requireStaffOrAdmin, (req: Request, res: Response) => {
  try {
    const { title, titleBn, category, excerpt, content, imageUrl, readTime, author, authorRole } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: 'Title, category and content are required' });
    }

    const id = 'BLOG-' + Date.now().toString(36);

    dbManager.run(
      `INSERT INTO blog_posts (
        id, title, title_bn, category, excerpt,
        content, image_url, read_time, author, author_role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      title,
      titleBn || null,
      category,
      excerpt || null,
      content,
      imageUrl || null,
      readTime || '4 min',
      author || 'Veterinary Team',
      authorRole || 'Pet Care Specialist'
    );

    const created = dbManager.get<any>('SELECT * FROM blog_posts WHERE id = ?', id);
    res.status(201).json({ success: true, message: 'Blog post published', data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
