const cors = require('cors');
const express = require('express');

const { clientUrl } = require('./config/env');

const app = express();

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'financial-tracker-api',
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

module.exports = app;
