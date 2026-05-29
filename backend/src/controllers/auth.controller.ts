import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/db.service';

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password, role } = req.body;
    
    if (!userId || !password || !role) {
      return res.status(400).json({ success: false, message: 'User ID, password and role are required' });
    }
    
    const user = dbService.getUserByUserId(userId);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (user.role !== role) {
      return res.status(400).json({ success: false, message: 'Role mismatch' });
    }
    
    if (user.status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Your account is deactivated' });
    }
    
    // Update last login timestamp
    const lastLoginStr = new Date().toISOString();
    dbService.updateUser(user.id, { lastLogin: lastLoginStr });
    
    // Add login entry to audit logs
    dbService.addAuditLog(user.userId, 'USER_LOGIN', `User successfully logged in with role: ${role}`);
    
    const token = `mock-jwt-token-${user.userId}`;
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        status: user.status,
        lastLogin: lastLoginStr
      }
    });
  } catch (error) {
    next(error);
  }
};
