import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Inactivity warning states
  public showTimeoutWarning$ = new BehaviorSubject<boolean>(false);
  public timeoutCountdown$ = new BehaviorSubject<number>(60);
  
  private lastActivity: number = Date.now();
  private inactivityCheckInterval: any;
  private countdownInterval: any;
  
  constructor(
    private apiService: ApiService,
    private router: Router,
    private ngZone: NgZone
  ) {
    const savedUser = localStorage.getItem('mploychek_user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        this.currentUserSubject.next(userObj);
        this.startInactivityMonitoring();
      } catch (e) {
        localStorage.removeItem('mploychek_user');
      }
    }
  }
  
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  public get isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
  
  login(credentials: any): Observable<AuthResponse> {
    this.apiService.showLoading('Fetching credentials and authenticating...');
    return this.apiService.post<AuthResponse>('auth/login', credentials).pipe(
      tap(res => {
        if (res.success && res.token && res.user) {
          localStorage.setItem('mploychek_token', res.token);
          localStorage.setItem('mploychek_user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
          this.startInactivityMonitoring();
        }
      }),
      finalize(() => {
        this.apiService.hideLoading();
      })
    );
  }
  
  logout() {
    this.stopInactivityMonitoring();
    localStorage.removeItem('mploychek_token');
    localStorage.removeItem('mploychek_user');
    this.currentUserSubject.next(null);
    this.showTimeoutWarning$.next(false);
    this.router.navigate(['/auth/login']);
  }
  
  private logoutDueToTimeout() {
    this.stopInactivityMonitoring();
    localStorage.removeItem('mploychek_token');
    localStorage.removeItem('mploychek_user');
    this.currentUserSubject.next(null);
    this.showTimeoutWarning$.next(false);
    this.ngZone.run(() => {
      this.router.navigate(['/auth/login'], { queryParams: { timeout: 'true' } });
    });
  }
  
  // Inactivity monitoring
  public recordInteraction() {
    this.lastActivity = Date.now();
  }
  
  private startInactivityMonitoring() {
    this.stopInactivityMonitoring();
    this.recordInteraction();
    
    // Execute outside Angular zone to avoid triggering change detection on every check
    this.ngZone.runOutsideAngular(() => {
      this.inactivityCheckInterval = setInterval(() => {
        const elapsed = Date.now() - this.lastActivity;
        const warningThreshold = 4 * 60 * 1000; // 4 minutes
        const timeoutThreshold = 5 * 60 * 1000; // 5 minutes
        
        if (elapsed >= timeoutThreshold) {
          this.logoutDueToTimeout();
        } else if (elapsed >= warningThreshold && !this.showTimeoutWarning$.value) {
          this.ngZone.run(() => {
            this.startWarningCountdown(Math.ceil((timeoutThreshold - elapsed) / 1000));
          });
        }
      }, 5000);
    });
  }
  
  private stopInactivityMonitoring() {
    if (this.inactivityCheckInterval) {
      clearInterval(this.inactivityCheckInterval);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.showTimeoutWarning$.next(false);
  }
  
  private startWarningCountdown(initialSeconds: number) {
    this.timeoutCountdown$.next(initialSeconds);
    this.showTimeoutWarning$.next(true);
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.countdownInterval = setInterval(() => {
      const remaining = this.timeoutCountdown$.value - 1;
      if (remaining <= 0) {
        clearInterval(this.countdownInterval);
        this.logoutDueToTimeout();
      } else {
        this.timeoutCountdown$.next(remaining);
      }
    }, 1000);
  }
  
  public keepSessionAlive() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.showTimeoutWarning$.next(false);
    this.recordInteraction();
    this.startInactivityMonitoring();
  }
}
