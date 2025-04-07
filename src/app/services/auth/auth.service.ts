import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface IUser {
  Name?: string;
  Email?: string;
  ProfileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.logout();
      } else {
        this.tokenSubject.next(token);
        this.loadUserFromStorage();
      }
    }
  }
  private loadUserFromStorage() {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.clearCurrentUser();
      }
    }
  }
  login(loginID: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/auth`, { loginID, password }).pipe(
      tap(response => {
        if (response.token) {
          this.storeToken(response.token);
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  get currentToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
    this.clearCurrentUser();
  }

  setCurrentUser(user: IUser) {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearCurrentUser() {
    this.currentUserSubject.next(null);
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }
}