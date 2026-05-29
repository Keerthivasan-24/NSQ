import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { AuditLogResponse } from '../models/audit-log.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUsers(): Observable<{ success: boolean; users: User[] }> {
    return this.apiService.get<{ success: boolean; users: User[] }>('users');
  }

  createUser(user: any): Observable<{ success: boolean; user: User }> {
    return this.apiService.post<{ success: boolean; user: User }>('users', user);
  }

  updateUser(id: string, user: any): Observable<{ success: boolean; user: User }> {
    return this.apiService.put<{ success: boolean; user: User }>(`users/${id}`, user);
  }

  deleteUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`users/${id}`);
  }

  getAuditLogs(): Observable<AuditLogResponse> {
    return this.apiService.get<AuditLogResponse>('users/logs/audit');
  }
}
