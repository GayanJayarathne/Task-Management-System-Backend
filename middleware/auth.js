const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ message: 'Access token missing' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ error:err,message: 'Invalid or expired token',secretKey:"secretKey" });
        req.user = user;
        next();
    });
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
};
