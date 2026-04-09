const cors = require('cors');
const express = require('express');

const errorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const budgetRoutes = require('./routes/budget.routes');
const categoryRoutes = require('./routes/category.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const healthRoutes = require('./routes/health.routes');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();

app.disable('x-powered-by');
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use(errorHandler);

module.exports = app;
