import { Router } from 'express';
import { getRecords } from '../controllers/record.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getRecords);

export default router;
