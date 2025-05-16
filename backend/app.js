const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const reservationRoutes = require('./routes/reservations');

app.use('/api', authRoutes);
app.use('/api', restaurantRoutes);
app.use('/api', reservationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
