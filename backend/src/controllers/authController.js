const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ¡No olvides importar esto arriba!

exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // 1. Verificar si el usuario ya existe
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // 2. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insertar en la base de datos (Rol 3 = CLIENT por defecto)
        await db.query(
            'INSERT INTO users (full_name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, 3]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al registrar' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar si el usuario existe por su email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        const user = users[0];

        // 2. Comparar la contraseña ingresada con el hash guardado
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Generar el JWT (El "Pasaporte")
        // Guardamos el ID y el ROL dentro del token para validaciones futuras
        const token = jwt.sign(
            { id: user.id, role_id: user.role_id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Expira en 24 horas
        );

        // 4. Enviar respuesta exitosa con el token y datos básicos del usuario
        res.json({ 
            message: 'Login exitoso',
            token, 
            user: { 
                id: user.id, 
                name: user.full_name, 
                email: user.email,
                role_id: user.role_id 
            } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
    }
};