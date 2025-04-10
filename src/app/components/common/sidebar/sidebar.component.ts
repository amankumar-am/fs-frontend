import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, debounceTime } from 'rxjs/operators';
import { MenuService } from '../../../services/api/menuService/menu.service';
import { Subscription, fromEvent } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService, IUser } from '../../../services/auth/auth.service';
import { IUserMenu } from '../../../interfaces/menu';
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

  menuItems: IUserMenu[] = [];
  masterItems: IUserMenu[] = [];
  currentRoute = '';
  isCollapsed = false;
  isMobile = false;
  isMobileMenuOpen = false;
  user: IUser = {
    name: "Guest User",
    email: "guest@example.com",
    profileImage: ''
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
    this.menuService.getUserMenuItems().subscribe({
      next: (items) => {
        this.menuItems = [];
        this.masterItems = [];

        items.forEach(item => {
          const mappedItem = {
            userId: item.userId,
            userLoginId: item.userLoginId,
            userName: item.userName,
            userEmail: item.userEmail,
            userProfileImage: item.userProfileImage,
            menuId: item.menuId,
            menuName: item.menuName?.trim() ?? '',
            menuPath: item.menuPath?.trim() ?? '',
            menuIcon: item.menuIcon?.trim() ?? '',
            menuCategory: item.menuCategory,
            canView: item.canView,
            canAdd: item.canAdd,
            canUpdate: item.canUpdate,
            canDelete: item.canDelete,
          };

          if (item.menuCategory === 0 && item.canView) {
            this.menuItems.push(mappedItem);
          } else if (item.menuCategory === 1 && item.canView) {
            this.masterItems.push(mappedItem);
          }
          this.user = {
            name: item.userName,
            email: item.userEmail,
            profileImage: item.userProfileImage,
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
        name: user?.name || "",
        email: user?.email || "",
        profileImage: user?.profileImage || ''
      };
    });
  }
}