import { Component, OnInit, OnDestroy, inject, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { filter, debounceTime } from 'rxjs/operators';
import { MenuService } from '../../../services/api/menuService/menu.service';
import { Subscription, fromEvent } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService, IUser } from '../../../services/auth/auth.service';
import { IMenu } from '../../../interfaces/menu';
import { MenuStateService } from '../../../services/api/menuService/menu-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent implements OnInit {
  private menuService = inject(MenuService); // Or use constructor injection
  private router = inject(Router);
  private resizeSubscription!: Subscription;
  private routeSubscription!: Subscription;
  @Output() collapsedState = new EventEmitter<boolean>();

  menuItems: IMenu[] = [];
  masterItems: IMenu[] = [];
  currentRoute = '';
  isCollapsed = false;
  isMobile = false;
  isMobileMenuOpen = false;
  user: IUser = {
    Name: "Guest User",
    Email: "guest@example.com",
    ProfileImage: ''
  };

  constructor(
    private authService: AuthService,
    private menuState: MenuStateService
  ) { }
  ngOnInit(): void {
    this.checkIfMobile();
    this.setupResizeListener();
    this.loadMenuItems();
    this.setupRouteTracking();
    this.setupUserSubscription();

    this.menuState.menuUpdated$.subscribe(() => {
      this.loadMenuItems();
    });
  }

  private loadMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = [];
        this.masterItems = [];

        items.forEach(item => {
          const mappedItem = {
            id: item.id,
            name: item.name?.trim() ?? '',
            path: item.path?.trim() ?? '',
            icon: item.icon?.trim() ?? ''
          };

          if (item.category === 0) {
            this.menuItems.push(mappedItem);
          } else if (item.category === 1) {
            this.masterItems.push(mappedItem);
          }
        });
      },
      error: (err) => console.error('Error fetching menu items:', err)
    });
  }

  private setupRouteTracking(): void {
    this.routeSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.closeMobileMenu();
      });
  }

  private setupResizeListener(): void {
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => this.checkIfMobile());
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) this.isMobileMenuOpen = false;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedState.emit(this.isCollapsed);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  isActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  private setupUserSubscription(): void {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.user = {
        Name: user?.Name || "",
        Email: user?.Email || "",
        ProfileImage: user?.ProfileImage || ''
      };
    });
  }
}