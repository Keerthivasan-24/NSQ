import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { dbService } from '../services/db.service';

export const getRecords = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    let records;
    
    if (user.role === 'Admin') {
      records = dbService.getRecords();
    } else {
      records = dbService.getRecordsByUserId(user.userId);
    }
    
    res.json({
      success: true,
      records
    });
  } catch (error) {
    next(error);
  }
};
