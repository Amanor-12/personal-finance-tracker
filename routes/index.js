const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Personal Finance Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;