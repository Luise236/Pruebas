const db = require('../config/db');

// Obtener las reservas del usuario actual (o todas si es Admin)
exports.getReservations = async (req, res) => {
    try {
        // Mejorado: Ordenamos por fecha y luego por hora
        let query = 'SELECT * FROM reservations WHERE user_id = ? ORDER BY fecha DESC, start_time DESC';
        let params = [req.user.id];

        if (req.user.role_id === 1) { // Si es Admin, ve todas
            query = 'SELECT r.*, u.full_name FROM reservations r JOIN users u ON r.user_id = u.id ORDER BY r.fecha DESC, r.start_time DESC';
            params = [];
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ message: 'Error al obtener reservas' });
    }
};

// Crear una nueva reserva
exports.createReservation = async (req, res) => {
    try {
        const { court_id, fecha, start_time, end_time } = req.body;
        const user_id = req.user.id;

        // Validación para evitar errores si faltan datos
        if (!court_id || !fecha || !start_time || !end_time) {
            return res.status(400).json({ message: 'Faltan campos obligatorios: court_id, fecha, start_time y end_time son requeridos.' });
        }

        await db.query(
            'INSERT INTO reservations (user_id, court_id, fecha, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
            [user_id, court_id, fecha, start_time, end_time]
        );

        res.status(201).json({ message: 'Reserva creada con éxito' });
    } catch (error) {
        console.error('Error al guardar la reserva:', error);
        res.status(500).json({ message: 'Error al guardar la reserva' });
    }
};