import { Request, Response, NextFunction } from 'express';
import { dbService, User } from '../services/db.service';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
  const user = dbService.getUserByUserId(userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User session expired or user not found' });
  }
  
  // Exclude password from the request object for security
  const { password, ...userWithoutPassword } = user;
  req.user = userWithoutPassword as User;
  next();
};

export const requireRole = (role: 'Admin' | 'General User') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ success: false, message: `Access denied. Requires ${role} role.` });
    }
    next();
  };
};
