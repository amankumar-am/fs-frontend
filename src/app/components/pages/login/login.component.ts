import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginID: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  constructor(private http: HttpClient, private router: Router) { }

  credentials = {
    LoginID: '',
    Password: ''
  };

  login() {
    console.log(this.loginID);
    console.log(this.password);

    this.http.post<any>('http://localhost:3000/login', { loginID: this.loginID, password: this.password })
      .subscribe(
        response => {
          this.isLoading = true;
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']); // Redirect after successful login
        },
        error => {
          this.errorMessage = 'Invalid login credentials';
        }
      );
  }
}