import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Import your AuthService

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService, // Inject AuthService
        private router: Router
    ) { }

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) { // Use AuthService's method
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}