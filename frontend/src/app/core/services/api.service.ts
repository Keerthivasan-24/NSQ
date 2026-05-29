import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';
  
  // Selected latency (in seconds): default is 1s
  public latency$ = new BehaviorSubject<number>(1);
  
  // Global loading states
  public loading$ = new BehaviorSubject<boolean>(false);
  public loadingMessage$ = new BehaviorSubject<string>('');
  
  constructor(private http: HttpClient) {
    const savedLatency = localStorage.getItem('mploychek_latency');
    if (savedLatency) {
      this.latency$.next(parseInt(savedLatency, 10));
    }
  }
  
  setLatency(seconds: number) {
    localStorage.setItem('mploychek_latency', seconds.toString());
    this.latency$.next(seconds);
  }
  
  getLatency(): number {
    return this.latency$.value;
  }
  
  showLoading(message: string = 'Synchronizing with server...') {
    this.loadingMessage$.next(message);
    this.loading$.next(true);
  }
  
  hideLoading() {
    this.loading$.next(false);
    this.loadingMessage$.next('');
  }
  
  get<T>(path: string, options: any = {}): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, options) as Observable<T>;
  }
  
  post<T>(path: string, body: any, options: any = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body, options) as Observable<T>;
  }
  
  put<T>(path: string, body: any, options: any = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body, options) as Observable<T>;
  }
  
  delete<T>(path: string, options: any = {}): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`, options) as Observable<T>;
  }
}
