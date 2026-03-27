const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.json({
    message: 'Protected categories endpoint – authenticated!',
    user: req.user,
    note: 'In full app this would return user categories from DB'
  });
});

module.exports = router;
