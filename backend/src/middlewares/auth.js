const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Aquí guardamos el id y el role_id del usuario
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token no válido' });
    }
};