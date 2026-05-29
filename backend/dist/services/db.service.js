"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DBService {
    filePath;
    constructor() {
        const rootPath = process.cwd();
        const srcPath = path.join(rootPath, 'src', 'data', 'db.json');
        const distPath = path.join(rootPath, 'dist', 'data', 'db.json');
        if (fs.existsSync(srcPath)) {
            this.filePath = srcPath;
        }
        else if (fs.existsSync(distPath)) {
            this.filePath = distPath;
        }
        else {
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
    read() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading database file, returning empty DB', error);
            return { users: [], records: [], auditLogs: [] };
        }
    }
    write(data) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (error) {
            console.error('Error writing to database file', error);
        }
    }
    // User Operations
    getUsers() {
        return this.read().users;
    }
    getUserById(id) {
        return this.getUsers().find(u => u.id === id);
    }
    getUserByUserId(userId) {
        return this.getUsers().find(u => u.userId.toLowerCase() === userId.toLowerCase());
    }
    addUser(user) {
        const db = this.read();
        db.users.push(user);
        this.write(db);
        return user;
    }
    updateUser(id, updatedUser) {
        const db = this.read();
        const index = db.users.findIndex(u => u.id === id);
        if (index === -1)
            return null;
        db.users[index] = { ...db.users[index], ...updatedUser };
        this.write(db);
        return db.users[index];
    }
    deleteUser(id) {
        const db = this.read();
        const initialLength = db.users.length;
        db.users = db.users.filter(u => u.id !== id);
        if (db.users.length === initialLength)
            return false;
        this.write(db);
        return true;
    }
    // Record Operations
    getRecords() {
        return this.read().records;
    }
    getRecordsByUserId(userId) {
        return this.getRecords().filter(r => r.userId.toLowerCase() === userId.toLowerCase());
    }
    // Audit Log Operations
    getAuditLogs() {
        return this.read().auditLogs;
    }
    addAuditLog(userId, action, details) {
        const db = this.read();
        const newLog = {
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
exports.dbService = new DBService();
