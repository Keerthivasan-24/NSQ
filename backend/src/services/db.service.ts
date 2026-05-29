import * as fs from 'fs';
import * as path from 'path';

export interface User {
  id: string;
  userId: string;
  name: string;
  role: 'Admin' | 'General User';
  password?: string;
  status: string;
  lastLogin: string;
}

export interface Record {
  id: string;
  userId: string;
  verificationType: string;
  status: string;
  submittedDate: string;
  accessLevel: string;
  processingTime: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
}

interface DB {
  users: User[];
  records: Record[];
  auditLogs: AuditLog[];
}

class DBService {
  private filePath: string;

  constructor() {
    const rootPath = process.cwd();
    const srcPath = path.join(rootPath, 'src', 'data', 'db.json');
    const distPath = path.join(rootPath, 'dist', 'data', 'db.json');
    
    if (fs.existsSync(srcPath)) {
      this.filePath = srcPath;
    } else if (fs.existsSync(distPath)) {
      this.filePath = distPath;
    } else {
      this.filePath = path.join(__dirname, '..', 'data', 'db.json');
    }
    
    // Ensure the data folder and file exist
    const parentDir = path.dirname(this.filePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      // Create empty db.json structure if missing
      fs.writeFileSync(this.filePath, JSON.stringify({ users: [], records: [], auditLogs: [] }, null, 2), 'utf-8');
    }
  }

  private read(): DB {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database file, returning empty DB', error);
      return { users: [], records: [], auditLogs: [] };
    }
  }

  private write(data: DB): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to database file', error);
    }
  }

  // User Operations
  getUsers(): User[] {
    return this.read().users;
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByUserId(userId: string): User | undefined {
    return this.getUsers().find(u => u.userId.toLowerCase() === userId.toLowerCase());
  }

  addUser(user: User): User {
    const db = this.read();
    db.users.push(user);
    this.write(db);
    return user;
  }

  updateUser(id: string, updatedUser: Partial<User>): User | null {
    const db = this.read();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    db.users[index] = { ...db.users[index], ...updatedUser };
    this.write(db);
    return db.users[index];
  }

  deleteUser(id: string): boolean {
    const db = this.read();
    const initialLength = db.users.length;
    db.users = db.users.filter(u => u.id !== id);
    if (db.users.length === initialLength) return false;
    this.write(db);
    return true;
  }

  // Record Operations
  getRecords(): Record[] {
    return this.read().records;
  }

  getRecordsByUserId(userId: string): Record[] {
    return this.getRecords().filter(r => r.userId.toLowerCase() === userId.toLowerCase());
  }

  // Audit Log Operations
  getAuditLogs(): AuditLog[] {
    return this.read().auditLogs;
  }

  addAuditLog(userId: string, action: string, details: string): AuditLog {
    const db = this.read();
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId,
      action,
      details
    };
    db.auditLogs.unshift(newLog); // Show newer logs first
    this.write(db);
    return newLog;
  }
}

export const dbService = new DBService();
