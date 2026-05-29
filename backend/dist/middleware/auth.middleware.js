"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const db_service_1 = require("../services/db.service");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token required' });
    }
    const token = authHeader.split(' ')[1];
    // Simulating verification: token format is mock-jwt-token-<userId>
    const tokenPrefix = 'mock-jwt-token-';
    if (!token.startsWith(tokenPrefix)) {
        return res.status(401).json({ success: false, message: 'Invalid token format' });
    }
    const userId = token.substring(tokenPrefix.length);
    const user = db_service_1.dbService.getUserByUserId(userId);
    if (!user) {
        return res.status(401).json({ success: false, message: 'User session expired or user not found' });
    }
    // Exclude password from the request object for security
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
};
exports.authMiddleware = authMiddleware;
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ success: false, message: `Access denied. Requires ${role} role.` });
        }
        next();
    };
};
exports.requireRole = requireRole;
