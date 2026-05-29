import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });

    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Show session timeout alert if query param matches
    if (this.route.snapshot.queryParams['timeout'] === 'true') {
      setTimeout(() => {
        this.snackBar.open('Session expired due to inactivity. Please log in again.', 'OK', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }, 500);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.snackBar.open(`Welcome back, ${res.user.name}!`, 'Dismiss', {
          duration: 3500,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Login failed. Please check your credentials.';
        this.snackBar.open(errorMsg, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['warn-snackbar']
        });
      }
    });
  }
}
