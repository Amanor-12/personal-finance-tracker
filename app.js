require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;