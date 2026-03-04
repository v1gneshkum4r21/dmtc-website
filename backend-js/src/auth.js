const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-this-in-production';
const ALGORITHM = 'HS256';
const ACCESS_TOKEN_EXPIRE_MINUTES = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '30');

function verifyPassword(plain, hashed) {
    return bcrypt.compareSync(plain, hashed);
}

function hashPassword(plain) {
    return bcrypt.hashSync(plain, 10);
}

function createAccessToken(payload, expireMinutes = ACCESS_TOKEN_EXPIRE_MINUTES) {
    return jwt.sign(payload, SECRET_KEY, {
        algorithm: ALGORITHM,
        expiresIn: expireMinutes * 60,
    });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ detail: 'Not authenticated' });

    try {
        const payload = jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] });
        req.user = payload; // { sub: username, iat, exp }
        next();
    } catch {
        return res.status(401).json({ detail: 'Could not validate credentials' });
    }
}

module.exports = {
    verifyPassword,
    hashPassword,
    createAccessToken,
    authenticateToken,
    ACCESS_TOKEN_EXPIRE_MINUTES,
};
