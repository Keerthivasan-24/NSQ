"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply auth middleware and require Admin role for all routes in this file
router.use(auth_middleware_1.authMiddleware);
router.use((0, auth_middleware_1.requireRole)('Admin'));
router.get('/', user_controller_1.getUsers);
router.post('/', user_controller_1.createUser);
router.put('/:id', user_controller_1.updateUser);
router.delete('/:id', user_controller_1.deleteUser);
// Audit logs is also admin-only
router.get('/logs/audit', user_controller_1.getAuditLogs);
exports.default = router;
