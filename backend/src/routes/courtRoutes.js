const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ajusta según tu conexión a MySQL

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM courts');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las canchas:', error);
    res.status(500).json({ message: 'Error interno al obtener las canchas' });
  }
});

module.exports = router;