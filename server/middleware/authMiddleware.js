const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
    // Get token from header (e.g., 'Bearer TOKEN')
    const authHeader = req.header('authorization');
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ msg: 'Malformed token, authorization denied' });
    }

    try {
        // Verify the token using the ACCESS secret
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};