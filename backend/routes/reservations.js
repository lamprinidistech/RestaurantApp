const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/user/reservations', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const [rows] = await db.query(
      `SELECT r.reservation_id, r.restaurant_id, r.date, r.time, r.people_count, t.name AS restaurant_name
       FROM reservations r
       JOIN restaurants t ON r.restaurant_id = t.restaurant_id
       WHERE r.user_id = ?
       ORDER BY r.date DESC`,
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Σφάλμα κατά την ανάκτηση κρατήσεων.' });
  }
});

router.post('/reservations', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const { restaurant_id, date, time, people_count } = req.body;

  try {
    await db.query(
      'INSERT INTO reservations (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)',
      [user_id, restaurant_id, date, time, people_count]
    );
    res.status(201).json({ message: 'Κράτηση καταχωρήθηκε!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Σφάλμα κατά την καταχώρηση κράτησης.' });
  }
});

router.put('/reservations/:id', authenticateToken, async (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.user_id;
  const { restaurant_id, date, time, people_count } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE reservations
       SET restaurant_id = ?, date = ?, time = ?, people_count = ?
       WHERE reservation_id = ? AND user_id = ?`,
      [restaurant_id, date, time, people_count, reservationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Η κράτηση δεν βρέθηκε ή δεν ανήκει σε εσένα.' });
    }

    res.json({ message: 'Η κράτηση ενημερώθηκε επιτυχώς!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Σφάλμα κατά την ενημέρωση κράτησης.' });
  }
});

router.delete('/reservations/:id', authenticateToken, async (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.user_id;

  try {
    const [result] = await db.query(
      'DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?',
      [reservationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Δεν βρέθηκε η κράτηση.' });
    }

    res.status(200).json({ message: 'Η κράτηση διαγράφηκε.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Σφάλμα κατά τη διαγραφή κράτησης.' });
  }
});

module.exports = router;
;