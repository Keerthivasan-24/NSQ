import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { dbService } from '../services/db.service';

export const getUsers = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = dbService.getUsers().map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const createUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, name, role, password, status } = req.body;
    if (!userId || !name || !role || !password) {
      return res.status(400).json({ success: false, message: 'All fields (userId, name, role, password) are required' });
    }
    
    const existingUser = dbService.getUserByUserId(userId);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User ID already exists' });
    }
    
    const newUser = dbService.addUser({
      id: `usr-${Date.now()}`,
      userId,
      name,
      role,
      password,
      status: status || 'Active',
      lastLogin: ''
    });
    
    dbService.addAuditLog(req.user!.userId, 'USER_CREATE', `Created user ${userId} (${name}) with role: ${role}`);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const updateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, role, status, password } = req.body;
    
    const existingUser = dbService.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (password !== undefined && password !== '') updateData.password = password;
    
    const updatedUser = dbService.updateUser(id, updateData);
    if (!updatedUser) {
      return res.status(500).json({ success: false, message: 'Failed to update user' });
    }
    
    dbService.addAuditLog(req.user!.userId, 'USER_UPDATE', `Updated user ${existingUser.userId}. Fields updated: ${Object.keys(updateData).join(', ')}`);
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userToDelete = dbService.getUserById(id);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (userToDelete.userId === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete the default Admin account' });
    }
    
    const success = dbService.deleteUser(id);
    if (!success) {
      return res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
    
    dbService.addAuditLog(req.user!.userId, 'USER_DELETE', `Deleted user ${userToDelete.userId}`);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const logs = dbService.getAuditLogs();
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};
