import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../services/api/menuService/menu.service';
import { CommonModule } from '@angular/common';
import { IMenu, IUserMenu } from '../../../interfaces/menu';
import { ToastrService } from 'ngx-toastr';
import { MenuStateService } from '../../../services/api/menuService/menu-state.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuItems: IUserMenu[] = [];
  isDeleting = false;
  userCanAddMenu = false;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private toastr: ToastrService,
    private menuStateService: MenuStateService
  ) {
  }
  ngOnInit(): void {
    this.menuService.getUserMenuItems().subscribe((items) => {
      this.menuItems = items;
      this.userCanAddMenu = this.getMenuCreateInfoForUser(items);
    });
  }

  addNewMenu() {
    // const redirectUrl = response.user?.role === 'admin' ? '/admin' : '/';
    this.router.navigate(['/menu/add']);
  }

  editMenuItem(item: IUserMenu) {
    let itemData: IMenu = {
      id: item.menuId,
      name: item.menuName
    }
    this.router.navigate(['/menu/add', item.menuId], { state: { itemData: itemData } })
  }

  deleteMenuItem(item: IUserMenu): void {
    if (confirm(`Delete "${item.menuName}"?`)) {
      this.menuService.deleteMenuItem(item.menuId).subscribe({
        next: () => {
          this.toastr.success('Menu deleted');
          this.loadMenuItems();
          this.menuStateService.notifyMenuUpdated(); // Notify subscribers
        },
        error: (err) => {
          this.toastr.error('Delete failed');
        }
      });
    }
  }

  // Make sure you have this separate method for loading items
  private loadMenuItems(): void {
    this.menuService.getUserMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
      },
      error: (err) => {
        this.toastr.error('Failed to load menus');
        console.error(err);
      }
    });
  }

  private getMenuCreateInfoForUser(userMenuData: IUserMenu[]): boolean {
    for (let item of userMenuData) {
      if (item.menuName.trim() === "Menu" && item.canAdd === true) {
        return true
      }
    }
    return false;
  }
}
