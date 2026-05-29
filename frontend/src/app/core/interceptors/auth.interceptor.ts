import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('mploychek_token');
    const latency = this.apiService.getLatency();

    // Always attach latency request header
    let headers = request.headers.set('X-Simulate-Latency', latency.toString());

    // Attach mock authorization token if user is authenticated
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const clonedRequest = request.clone({ headers });
    return next.handle(clonedRequest);
  }
}
