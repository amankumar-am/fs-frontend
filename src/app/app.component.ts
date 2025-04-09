import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/common/footer/footer.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { HeaderComponent } from './components/common/header/header.component';
import { AuthService } from './services/auth/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [CommonModule, HeaderComponent, FooterComponent, SidebarComponent, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'template_app';
    loggedIn = false;
    private authSubscription!: Subscription;
    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.loggedIn = this.authService.isLoggedIn();
        this.authSubscription = this.authService.isLoggedIn$.subscribe(
            (isLoggedIn) => {
                this.loggedIn = isLoggedIn;
            }
        );
    }

    ngOnDestroy(): void {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }
    isSidebarCollapsed = false;


    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
}
