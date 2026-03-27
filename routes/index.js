const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Personal Finance Tracker API is running',
    timestamp: new Date().toISOString(),
    routes: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login'],
      users: [
        'GET /api/users',
        'GET /api/users/:id',
        'PUT /api/users/:id',
        'DELETE /api/users/:id'
      ],
      categories: [
        'GET /api/categories',
        'GET /api/categories/:id',
        'POST /api/categories',
        'PUT /api/categories/:id',
        'DELETE /api/categories/:id'
      ]
    }
  });
});

module.exports = router;
