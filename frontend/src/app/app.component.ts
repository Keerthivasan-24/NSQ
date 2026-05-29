import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isDarkMode = false;
  selectedLatency = 1;

  constructor(
    public authService: AuthService,
    public apiService: ApiService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Check dark theme preference
    const savedTheme = localStorage.getItem('mploychek_dark_theme');
    if (savedTheme === 'true') {
      this.isDarkMode = true;
      this.document.body.classList.add('dark-theme');
    }

    // Subscribe to selected latency
    this.apiService.latency$.subscribe(val => {
      this.selectedLatency = val;
    });
  }

  // Monitor user events globally for session timeout
  @HostListener('document:mousemove')
  @HostListener('document:click')
  @HostListener('document:keypress')
  @HostListener('document:touchstart')
  onUserInteraction(): void {
    if (this.authService.isAuthenticated) {
      this.authService.recordInteraction();
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.document.body.classList.add('dark-theme');
      localStorage.setItem('mploychek_dark_theme', 'true');
    } else {
      this.document.body.classList.remove('dark-theme');
      localStorage.setItem('mploychek_dark_theme', 'false');
    }
  }

  changeLatency(seconds: number): void {
    this.apiService.setLatency(seconds);
  }

  keepSessionAlive(): void {
    this.authService.keepSessionAlive();
  }

  logout(): void {
    this.authService.logout();
  }
}
