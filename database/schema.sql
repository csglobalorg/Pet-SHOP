-- =========================================================================
-- Cox's Bazar Pet Shop & Care (Dokan ERP, POS & E-commerce)
-- Full Relational Database Schema
-- Compatible with PostgreSQL / Supabase and SQLite
-- =========================================================================

-- 1. Users Table (Customers, Cashiers, Managers, Admin)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) DEFAULT 'customer', -- 'admin', 'manager', 'cashier', 'customer'
    admin_pin_hash VARCHAR(255), -- Hashed quick-unlock PIN (e.g. '1234')
    membership_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table (Catalog & Inventory)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY, -- SKU / ID (e.g. 'CBZ-CAT-001')
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    category VARCHAR(50) NOT NULL, -- 'Pet Food', 'Litter & Hygiene', 'Accessories & Toys', etc.
    pet_type VARCHAR(30) NOT NULL, -- 'Cat', 'Dog', 'Bird', 'All Pets'
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Selling price (৳)
    cost_price DECIMAL(10, 2) NOT NULL, -- Buying price (for profit/loss calculation)
    discount_price DECIMAL(10, 2), -- Offer price if applicable
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT DEFAULT 5, -- Alert threshold
    barcode VARCHAR(100) UNIQUE, -- Barcode scanner support
    unit VARCHAR(20) DEFAULT 'Piece',
    weight VARCHAR(50),
    image_url TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_flash_sale BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table (POS Counter & Online Sales)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(30) PRIMARY KEY, -- e.g. 'CBZ-1094'
    order_source VARCHAR(20) NOT NULL, -- 'POS' or 'ONLINE'
    customer_id VARCHAR(36) REFERENCES users(id),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT,
    delivery_area VARCHAR(50), -- 'Kolatoli', 'Laboni', 'Tekpara', 'Outside Cox\'s Bazar', etc.
    payment_method VARCHAR(30) NOT NULL, -- 'CASH', 'BKASH', 'NAGAD', 'CARD', 'DUE'
    payment_status VARCHAR(20) DEFAULT 'PENDING', -- 'PAID', 'PENDING', 'PARTIALLY_PAID'
    trx_id VARCHAR(100),
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    tendered_cash DECIMAL(10, 2), -- Cash handed over in POS
    change_returned DECIMAL(10, 2), -- Change given back
    order_status VARCHAR(30) DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'
    cashier_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id VARCHAR(30) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);

-- 5. Cash Registers Table (Daily Dokan Float & Reconciliation)
CREATE TABLE IF NOT EXISTS cash_registers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE UNIQUE NOT NULL, -- 'YYYY-MM-DD'
    opening_cash DECIMAL(10, 2) NOT NULL, -- Morning drawer cash float
    opening_notes TEXT,
    closing_cash DECIMAL(10, 2), -- Evening counted cash
    is_closed BOOLEAN DEFAULT false,
    opened_by VARCHAR(50),
    closed_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Expenses Table (Shop Expense Khata)
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Rent', 'Utilities', 'Salary', 'Logistics', 'Snacks', 'Other'
    payment_source VARCHAR(30) NOT NULL, -- 'Shop Drawer Cash', 'bKash Merchant', 'Bank'
    notes TEXT,
    receipt_url TEXT,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Customer Dues (Bakir Khata)
CREATE TABLE IF NOT EXISTS customer_dues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) UNIQUE NOT NULL,
    pet_name_breed VARCHAR(100),
    total_due DECIMAL(10, 2) DEFAULT 0,
    last_payment_date DATE,
    notes TEXT
);

-- 8. Customer Due Logs
CREATE TABLE IF NOT EXISTS customer_due_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_due_id INT NOT NULL REFERENCES customer_dues(id) ON DELETE CASCADE,
    order_id VARCHAR(30),
    type VARCHAR(20) NOT NULL, -- 'NEW_DUE', 'PAYMENT_RECEIVED'
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(30), -- 'CASH', 'BKASH'
    notes TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Suppliers Table (Mahajon Ledger)
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    company_name VARCHAR(150),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    total_purchased DECIMAL(12, 2) DEFAULT 0,
    total_paid DECIMAL(12, 2) DEFAULT 0,
    balance_due DECIMAL(12, 2) DEFAULT 0
);

-- 10. Inventory Restock Logs
CREATE TABLE IF NOT EXISTS inventory_restock_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INT REFERENCES suppliers(id),
    product_id VARCHAR(50) REFERENCES products(id),
    quantity_added INT NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    invoice_number VARCHAR(100),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Appointments Table (Grooming, Spa & Vet Care)
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(30) PRIMARY KEY, -- e.g. 'APT-2026-081'
    pet_name VARCHAR(100) NOT NULL,
    pet_type VARCHAR(50) NOT NULL, -- 'Cat', 'Dog', 'Other'
    pet_breed VARCHAR(100),
    owner_name VARCHAR(100) NOT NULL,
    owner_phone VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    preferred_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    read_time VARCHAR(20),
    author VARCHAR(100),
    author_role VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Pet Listings Table (Adoption & Sale)
CREATE TABLE IF NOT EXISTS pet_listings (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    pet_type VARCHAR(30) NOT NULL,
    age VARCHAR(50),
    gender VARCHAR(20),
    price DECIMAL(10, 2) DEFAULT 0,
    is_adoption BOOLEAN DEFAULT false,
    image_url TEXT,
    vaccinated BOOLEAN DEFAULT false,
    dewormed BOOLEAN DEFAULT false,
    health_passport BOOLEAN DEFAULT false,
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    location VARCHAR(100) DEFAULT 'Cox''s Bazar',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_pet_type ON products(pet_type);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_order_source ON orders(order_source);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_customer_dues_phone ON customer_dues(customer_phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
