const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  const payload = {
    service: 'financial-tracker-backend-core',
    timestamp: new Date().toISOString(),
  };

  try {
    const database = await pool.checkDatabase();

    res.json({
      status: 'ok',
      database: database.status,
      ...payload,
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      database: 'error',
      message: error.message || 'Database health check failed.',
      ...payload,
    });
  }
});

module.exports = router;
