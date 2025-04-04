import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  loginID: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {
    // Basic validation
    if (!this.loginID || !this.password) {
      this.errorMessage = 'Both fields are required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginID, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;

        const redirectUrl = response.user?.role === 'admin' ? '/admin' : '/';
        this.router.navigate([redirectUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}