"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const db_service_1 = require("../services/db.service");
const getUsers = (req, res, next) => {
    try {
        const users = db_service_1.dbService.getUsers().map(u => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
        });
        res.json({ success: true, users });
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const createUser = (req, res, next) => {
    try {
        const { userId, name, role, password, status } = req.body;
        if (!userId || !name || !role || !password) {
            return res.status(400).json({ success: false, message: 'All fields (userId, name, role, password) are required' });
        }
        const existingUser = db_service_1.dbService.getUserByUserId(userId);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User ID already exists' });
        }
        const newUser = db_service_1.dbService.addUser({
            id: `usr-${Date.now()}`,
            userId,
            name,
            role,
            password,
            status: status || 'Active',
            lastLogin: ''
        });
        db_service_1.dbService.addAuditLog(req.user.userId, 'USER_CREATE', `Created user ${userId} (${name}) with role: ${role}`);
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ success: true, user: userWithoutPassword });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const updateUser = (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, role, status, password } = req.body;
        const existingUser = db_service_1.dbService.getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (role !== undefined)
            updateData.role = role;
        if (status !== undefined)
            updateData.status = status;
        if (password !== undefined && password !== '')
            updateData.password = password;
        const updatedUser = db_service_1.dbService.updateUser(id, updateData);
        if (!updatedUser) {
            return res.status(500).json({ success: false, message: 'Failed to update user' });
        }
        db_service_1.dbService.addAuditLog(req.user.userId, 'USER_UPDATE', `Updated user ${existingUser.userId}. Fields updated: ${Object.keys(updateData).join(', ')}`);
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json({ success: true, user: userWithoutPassword });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => {
    try {
        const { id } = req.params;
        const userToDelete = db_service_1.dbService.getUserById(id);
        if (!userToDelete) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (userToDelete.userId === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete the default Admin account' });
        }
        const success = db_service_1.dbService.deleteUser(id);
        if (!success) {
            return res.status(500).json({ success: false, message: 'Failed to delete user' });
        }
        db_service_1.dbService.addAuditLog(req.user.userId, 'USER_DELETE', `Deleted user ${userToDelete.userId}`);
        res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const getAuditLogs = (req, res, next) => {
    try {
        const logs = db_service_1.dbService.getAuditLogs();
        res.json({ success: true, logs });
    }
    catch (error) {
        next(error);
    }
};
exports.getAuditLogs = getAuditLogs;
