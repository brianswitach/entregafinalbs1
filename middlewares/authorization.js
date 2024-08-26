

const authorization = (role) => {
    return (req, res, next) => {
        const user = req.user; 

        if (!user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        if (role === 'admin' && user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado: se requiere rol de administrador' });
        }

        if (role === 'user' && user.role !== 'user') {
            return res.status(403).json({ message: 'Acceso denegado: se requiere rol de usuario' });
        }

        
        next();
    };
};

module.exports = authorization;
