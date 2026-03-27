const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT id, user_id, name, type, created_at FROM categories WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, user_id, name, type, created_at FROM categories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching category' });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  const normalizedType = String(type).toLowerCase();
  if (!['income', 'expense'].includes(normalizedType)) {
    return res.status(400).json({ message: 'Type must be either income or expense' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
      [req.user.id, String(name).trim(), normalizedType]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Category created successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating category' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, type } = req.body;

  if (!name && !type) {
    return res.status(400).json({ message: 'At least one field is required' });
  }

  if (type && !['income', 'expense'].includes(String(type).toLowerCase())) {
    return res.status(400).json({ message: 'Type must be either income or expense' });
  }

  try {
    const [existingRows] = await db.query(
      'SELECT id FROM categories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await db.query(
      'UPDATE categories SET name = IFNULL(?, name), type = IFNULL(?, type) WHERE id = ? AND user_id = ?',
      [name ? String(name).trim() : null, type ? String(type).toLowerCase() : null, req.params.id, req.user.id]
    );

    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating category' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM categories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting category' });
  }
});

module.exports = router;
