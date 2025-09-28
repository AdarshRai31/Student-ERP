const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");
const { isBlacklisted } = require("./utils/tokenBlacklist");

const authMiddlware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({error: 'Authorization header missing or malformed'});
    }

    const token = authHeader.split(' ')[1];

    try {
        // Check if token is blacklisted
        if (isBlacklisted(token)) {
            return res.status(401).json({ error: 'Token has been invalidated. Please log in again.' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.userId) {
            // Store both the userId and the full decoded token as user
            req.userId = decoded.userId;
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                studentId: decoded.studentId
            };
            next();
        } else {
            return res.status(403).json({error: 'Invalid token payload'});
        }
        
    } catch (err) {
        return res.status(403).json({error: 'Invalid or expired token'});
    }
};

module.exports = {
    authMiddlware
}