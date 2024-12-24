const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { JWT_SECRET } = process.env;

/**
 * 
 * @param {*string} token JWT Authorization token 
 * @returns 
 */
// Middleware to verify the token using UserService
const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({message: 'Token is required'});
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);  // This will throw an error if the token is invalid or expired
        req.user = decoded; // Attach decoded user info to the request object (optional)
        next(); // Forward to the appropriate service
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token'});
    }
};

module.exports = { verifyToken };