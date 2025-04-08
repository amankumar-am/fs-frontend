import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../services/api/menuService/menu.service';
import { CommonModule } from '@angular/common';
import { IMenu } from '../../../interfaces/menu';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../../common/sidebar/sidebar.component';
import { MenuStateService } from '../../../services/api/menuService/menu-state.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuItems: IMenu[] = [];
  isDeleting = false;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private toastr: ToastrService,
    private menuStateService: MenuStateService
  ) {
  }
  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe((items) => {
      this.menuItems = items;
    });
  }

  addNewMenu() {
    // const redirectUrl = response.user?.role === 'admin' ? '/admin' : '/';
    this.router.navigate(['/menu/add']);
  }

  editMenuItem(item: any) {
    console.log(item);
    this.router.navigate(['/menu/add', item.id], { state: { itemData: item } })
  }

  deleteMenuItem(item: IMenu): void {
    if (confirm(`Delete "${item.name}"?`)) {
      this.menuService.deleteMenuItem(item.id).subscribe({
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
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
      },
      error: (err) => {
        this.toastr.error('Failed to load menus');
        console.error(err);
      }
    });
  }
}
