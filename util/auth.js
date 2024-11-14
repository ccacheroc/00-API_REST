import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-secret-key'; // Usar variable de entorno o clave por defecto

export function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        perfil: user.perfil
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' }); //7d
};

export function verifyToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};

export function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const user = verifyToken(token);
        if (!user) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user; // Asegurarse de que el perfil se extraiga correctamente
        console.log(`User ID: ${user.id}, Username: ${user.username}, Perfil: ${user.perfil}`);
        next();
    } catch (error) {
        console.error('Error during token authentication:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

