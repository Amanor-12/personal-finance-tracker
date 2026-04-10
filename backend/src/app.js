const cors = require('cors');
const express = require('express');

const errorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const budgetRoutes = require('./routes/budget.routes');
const categoryRoutes = require('./routes/category.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const healthRoutes = require('./routes/health.routes');
const transactionRoutes = require('./routes/transaction.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

app.disable('x-powered-by');
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Personal Finance Tracker API is running.',
    health: '/api/health',
    auth: '/api/auth',
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/users', usersRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found.',
    error: 'Route not found.',
  });
});

app.use(errorHandler);

module.exports = app;
