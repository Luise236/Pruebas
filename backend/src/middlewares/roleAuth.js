exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Asumiendo que req.user tiene el role_id. 
        // En tu BD: 1=ADMIN, 2=EMPLOYEE, 3=CLIENT
        if (!allowedRoles.includes(req.user.role_id)) {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }
        next();
    };
};
// Uso en ruta: router.delete('/:id', authorizeRoles(1), deleteReservation);