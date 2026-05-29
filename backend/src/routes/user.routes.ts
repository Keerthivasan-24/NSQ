import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, getAuditLogs } from '../controllers/user.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware and require Admin role for all routes in this file
router.use(authMiddleware);
router.use(requireRole('Admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Audit logs is also admin-only
router.get('/logs/audit', getAuditLogs);

export default router;
