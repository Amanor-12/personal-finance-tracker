const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET all users (protected)
router.get('/', auth, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, email FROM users');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// GET single user by ID (protected)
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
    if (user.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(user[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update user (protected) – only username/email for simplicity
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  if (!username && !email) return res.status(400).json({ message: 'No fields to update' });

  try {
    await db.query(
      'UPDATE users SET username = IFNULL(?, username), email = IFNULL(?, email) WHERE id = ?',
      [username, email, id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// DELETE user (protected)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;