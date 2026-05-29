export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
}

export interface AuditLogResponse {
  success: boolean;
  logs: AuditLog[];
}
