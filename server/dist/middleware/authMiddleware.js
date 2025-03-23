"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to check if user is logged inJ
const isAuthenticated = (req, res, next) => {
    try {
        // Get the token from the cookie
        const token = req.cookies.auth_token;
        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please log in.',
            });
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // Attach user info to the request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please log in again.',
            });
        }
        else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.',
            });
        }
        // Generic server error
        return res.status(500).json({
            success: false,
            message: 'Server error during authentication',
        });
    }
};
exports.default = isAuthenticated;
