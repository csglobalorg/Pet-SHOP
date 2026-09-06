import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Route handlers
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import dokanRoutes from './routes/dokan.routes';
import expenseRoutes from './routes/expense.routes';
import dueRoutes from './routes/due.routes';
import supplierRoutes from './routes/supplier.routes';
import appointmentRoutes from './routes/appointment.routes';
import analyticsRoutes from './routes/analytics.routes';
import contentRoutes from './routes/content.routes';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base API Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: "Cox's Bazar Pet Shop & Care Dokan ERP & POS Backend is operational",
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    partner: 'CGI IT Company'
  });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/inventory', productRoutes); // Maps /inventory/restock
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/dokan', dokanRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/dues', dueRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1', contentRoutes); // /pets and /blogs

// 404 Route Catch
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 ${config.shopName} - Dokan ERP & POS Backend`);
    console.log(`📍 Server running at: http://localhost:${config.port}`);
    console.log(`📋 Health check: http://localhost:${config.port}/api/v1/health`);
    console.log(`🔑 Admin PIN Unlock: ${config.adminDefaultPin}`);
    console.log(`🏢 Development Partner: CGI IT Company`);
    console.log(`=======================================================`);
  });
}

export default app;
