const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/restaurants', async (req, res) => {
  const { name, location } = req.query;

  try {
    let query = 'SELECT * FROM restaurants';
    const params = [];
    const conditions = [];

    if (name) {
      conditions.push('name LIKE ?');
      params.push(`%${name}%`);
    }

    if (location) {
      conditions.push('location LIKE ?');
      params.push(`%${location}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Σφάλμα κατά την ανάκτηση εστιατορίων.' });
  }
});

module.exports = router;
