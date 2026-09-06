import bcrypt from 'bcryptjs';
import { dbManager } from './db';
import { config } from '../server/config';
import {
  INITIAL_PRODUCTS,
  INITIAL_EXPENSES,
  INITIAL_CUSTOMER_DUES,
  INITIAL_SUPPLIERS,
  INITIAL_PET_LISTINGS,
  BLOG_POSTS,
  INITIAL_APPOINTMENTS
} from '../src/data/initialData';

export async function seedDatabase() {
  console.log('🌱 Starting Cox\'s Bazar Pet Shop & Care Database Seeder...');

  // 1. Seed Users (Admin with default PIN 1234, Manager, Cashier, Customer)
  const salt = await bcrypt.genSalt(10);
  const adminPinHash = await bcrypt.hash(config.adminDefaultPin, salt);
  const defaultPasswordHash = await bcrypt.hash('admin123', salt);
  const customerPasswordHash = await bcrypt.hash('pass123', salt);

  // Admin User
  const existingAdmin = dbManager.get('SELECT id FROM users WHERE phone = ?', '01800000000');
  if (!existingAdmin) {
    dbManager.run(
      `INSERT INTO users (id, phone, email, name, password_hash, role, admin_pin_hash, membership_points)
       VALUES ('USR-ADMIN-01', '01800000000', 'admin@coxsbazarpetshop.com', 'Admin Manager', ?, 'admin', ?, 1000)`,
      defaultPasswordHash,
      adminPinHash
    );
    console.log(`✅ Admin user seeded: Phone 01800000000 | PIN: ${config.adminDefaultPin}`);
  }

  // Cashier Staff User
  const existingCashier = dbManager.get('SELECT id FROM users WHERE phone = ?', '01811111111');
  if (!existingCashier) {
    dbManager.run(
      `INSERT INTO users (id, phone, email, name, password_hash, role, admin_pin_hash, membership_points)
       VALUES ('USR-CASHIER-01', '01811111111', 'cashier@coxsbazarpetshop.com', 'Counter Cashier', ?, 'cashier', ?, 200)`,
      defaultPasswordHash,
      adminPinHash
    );
  }



  // 2. Seed Products
  console.log(`📦 Seeding ${INITIAL_PRODUCTS.length} products...`);
  for (const prod of INITIAL_PRODUCTS) {
    const existing = dbManager.get('SELECT id FROM products WHERE id = ?', prod.id);
    if (!existing) {
      dbManager.run(
        `INSERT INTO products (
          id, name, name_bn, category, pet_type, brand,
          price, cost_price, discount_price, stock_quantity,
          low_stock_threshold, barcode, unit, weight,
          image_url, description, is_featured, is_flash_sale
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        prod.id,
        prod.title,
        prod.title,
        prod.category,
        prod.animalType.charAt(0).toUpperCase() + prod.animalType.slice(1),
        prod.brand,
        prod.price,
        prod.costPrice || Math.round(prod.price * 0.72),
        prod.originalPrice || null,
        prod.stock,
        5,
        prod.sku || prod.id,
        'Piece',
        prod.weightOrSize || null,
        prod.image,
        prod.description,
        prod.featured ? 1 : 0,
        prod.isFlashSale ? 1 : 0
      );
    }
  }

  // 3. Seed Suppliers
  console.log(`🏭 Seeding ${INITIAL_SUPPLIERS.length} suppliers...`);
  for (const sup of INITIAL_SUPPLIERS) {
    const existing = dbManager.get('SELECT id FROM suppliers WHERE name = ?', sup.supplierName);
    if (!existing) {
      dbManager.run(
        `INSERT INTO suppliers (name, company_name, phone, address, total_purchased, total_paid, balance_due)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        sup.supplierName,
        sup.brandOrGoods,
        sup.phone,
        sup.address,
        sup.totalPurchased,
        sup.totalPaid,
        sup.balanceDue
      );
    }
  }

  // 4. Seed Expenses
  console.log(`📑 Seeding ${INITIAL_EXPENSES.length} expense records...`);
  for (const exp of INITIAL_EXPENSES) {
    const existing = dbManager.get('SELECT id FROM expenses WHERE title = ? AND date = ?', exp.title, exp.date);
    if (!existing) {
      dbManager.run(
        `INSERT INTO expenses (date, title, amount, category, payment_source, notes, created_by)
         VALUES (?, ?, ?, ?, ?, ?, 'Admin')`,
        exp.date,
        exp.title,
        exp.amount,
        exp.category,
        exp.paymentSource === 'Drawer Cash' ? 'Shop Drawer Cash' : 'Bank/bKash',
        exp.notes || null
      );
    }
  }

  // 5. Seed Customer Dues
  console.log(`👥 Seeding ${INITIAL_CUSTOMER_DUES.length} customer dues...`);
  for (const due of INITIAL_CUSTOMER_DUES) {
    const existing = dbManager.get('SELECT id FROM customer_dues WHERE customer_phone = ?', due.customerPhone);
    if (!existing) {
      const insertRes = dbManager.run(
        `INSERT INTO customer_dues (customer_name, customer_phone, pet_name_breed, total_due, last_payment_date, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        due.customerName,
        due.customerPhone,
        due.petName || null,
        due.totalDue,
        due.lastUpdated,
        due.notes || null
      );

      if (due.totalDue > 0) {
        dbManager.run(
          `INSERT INTO customer_due_logs (customer_due_id, type, amount, payment_method, notes)
           VALUES (?, 'NEW_DUE', ?, 'DUE', 'Opening Due Balance')`,
          insertRes.lastInsertRowid,
          due.totalDue
        );
      }
    }
  }

  // 6. Seed Appointments
  console.log(`📅 Seeding ${INITIAL_APPOINTMENTS.length} appointments...`);
  for (const apt of INITIAL_APPOINTMENTS) {
    const existing = dbManager.get('SELECT id FROM appointments WHERE id = ?', apt.id);
    if (!existing) {
      dbManager.run(
        `INSERT INTO appointments (
          id, pet_name, pet_type, pet_breed, owner_name,
          owner_phone, service_type, preferred_date, time_slot, status, notes
        ) VALUES (?, ?, ?, 'Domestic Shorthair', ?, ?, ?, ?, ?, ?, ?)`,
        apt.id,
        apt.petName,
        apt.petType.charAt(0).toUpperCase() + apt.petType.slice(1),
        apt.ownerName,
        apt.ownerPhone,
        apt.serviceName,
        apt.preferredDate,
        apt.preferredTime,
        apt.status.toUpperCase(),
        apt.notes || null
      );
    }
  }

  // 7. Seed Pet Listings
  console.log(`🐾 Seeding ${INITIAL_PET_LISTINGS.length} pet listings...`);
  for (const pet of INITIAL_PET_LISTINGS) {
    const existing = dbManager.get('SELECT id FROM pet_listings WHERE id = ?', pet.id);
    if (!existing) {
      dbManager.run(
        `INSERT INTO pet_listings (
          id, name, breed, pet_type, age, gender, price,
          is_adoption, image_url, vaccinated, dewormed, health_passport,
          description, is_available, location
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        pet.id,
        pet.name,
        pet.breed,
        pet.animalType.charAt(0).toUpperCase() + pet.animalType.slice(1),
        pet.age,
        pet.gender,
        pet.price,
        pet.isAdoption ? 1 : 0,
        pet.imageUrl,
        pet.vaccinated ? 1 : 0,
        pet.dewormed ? 1 : 0,
        pet.healthPassport ? 1 : 0,
        pet.description,
        pet.available ? 1 : 0,
        pet.location || "Cox's Bazar"
      );
    }
  }

  // 8. Seed Blog Posts
  console.log(`📝 Seeding ${BLOG_POSTS.length} blog posts...`);
  for (const blog of BLOG_POSTS) {
    const existing = dbManager.get('SELECT id FROM blog_posts WHERE id = ?', blog.id);
    if (!existing) {
      const contentStr = JSON.stringify(blog.content);
      dbManager.run(
        `INSERT INTO blog_posts (
          id, title, title_bn, category, excerpt, content,
          image_url, read_time, author, author_role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        blog.id,
        blog.title,
        blog.titleBn || null,
        blog.category,
        blog.excerpt,
        contentStr,
        blog.image,
        blog.readTime,
        blog.author,
        blog.authorRole
      );
    }
  }

  // 9. Seed Today's Cash Register Float
  const today = new Date().toISOString().split('T')[0];
  const existingRegister = dbManager.get('SELECT id FROM cash_registers WHERE date = ?', today);
  if (!existingRegister) {
    dbManager.run(
      `INSERT INTO cash_registers (date, opening_cash, opening_notes, opened_by, is_closed)
       VALUES (?, 5000.00, 'Morning Cash Float for drawer change', 'Admin Manager', 0)`,
      today
    );
    console.log(`💵 Today's opening drawer cash float seeded: ৳5,000 for ${today}`);
  }

  console.log('🎉 Seeding completed successfully!');
}

// Direct execution
if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
