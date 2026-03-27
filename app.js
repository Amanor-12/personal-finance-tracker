require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');

const app = express();
const clientDistPath = path.join(__dirname, 'client', 'dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');
const hasClientBuild = fs.existsSync(clientIndexPath);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(clientIndexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'success',
      message: 'API is running. Build the client to serve the React dashboard from Express.',
      frontendDevUrl: 'http://localhost:5173',
      apiHealthUrl: '/api'
    });
  });
}

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
