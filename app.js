require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');

const app = express();
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: 'Internal Server Error'
  });
});

module.exports = app;
