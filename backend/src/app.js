const express = require('express');
const cors = require('cors'); // 1. Agrega esta línea
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// 2. Agrega esta línea (debe ir ANTES de las rutas)
app.use(cors());

app.use(express.json()); // Middleware para leer JSON (seguro ya lo tienes)

// Tus rutas
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courts', require('./routes/courtRoutes'));

module.exports = app;