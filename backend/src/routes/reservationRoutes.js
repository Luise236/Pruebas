const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middlewares/auth');

router.get('/', auth, reservationController.getReservations);
router.post('/', auth, reservationController.createReservation);

module.exports = router;