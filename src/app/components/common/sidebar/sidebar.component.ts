import { Component, OnInit, OnDestroy, inject, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { filter, debounceTime } from 'rxjs/operators';
import { MenuService, MenuType } from '../../../services/api/menuService/menu.service';
import { Subscription, fromEvent } from 'rxjs';
import { CommonModule } from '@angular/common';

interface UserType {
  name?: string;
  email?: string;
  profileImage?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent implements OnInit, OnDestroy {
  private menuService = inject(MenuService); // Or use constructor injection
  private router = inject(Router);
  private resizeSubscription!: Subscription;
  private routeSubscription!: Subscription;
  @Output() collapsedState = new EventEmitter<boolean>();

  menuItems: MenuType[] = [];
  user: UserType = {};
  currentRoute = '';
  isCollapsed = false;
  isMobile = false;
  isMobileMenuOpen = false;

  constructor() { } // If not using `inject()`, inject services here

  ngOnInit(): void {
    this.checkIfMobile();
    this.setupResizeListener();
    this.loadMenuItems();
    this.setupRouteTracking();
  }

  private loadMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items.map(item => ({
          MenuID: item.MenuID,
          Name: item.Name?.trim() ?? '',
          Path: item.Path?.trim() ?? '',
          Icon: item.Icon?.trim() ?? ''
        }));
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
}