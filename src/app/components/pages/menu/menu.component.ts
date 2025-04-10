import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../services/api/menuService/menu.service';
import { CommonModule } from '@angular/common';
import { IMenu, IUserMenu } from '../../../interfaces/menu';
import { ToastrService } from 'ngx-toastr';
import { MenuStateService } from '../../../services/api/menuService/menu-state.service';
import { FormsModule } from '@angular/forms';
const ITEMS_PER_PAGE_KEY = 'menu_items_per_page';
@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuItems: IUserMenu[] = [];
  isDeleting = false;
  userCanAddMenu = false;
  filteredItems: IUserMenu[] = [];
  searchTerm: string = '';

  // Pagination variables
  currentPage = 1;
  itemsPerPage = parseInt(localStorage.getItem(ITEMS_PER_PAGE_KEY) || '5', 10);
  totalItems = 0;
  pageInput: string | number = '';

  // Sorting variables
  sortColumn = 'menuName';
  sortDirection = 'asc';

  constructor(
    private menuService: MenuService,
    private router: Router,
    private toastr: ToastrService,
    private menuStateService: MenuStateService
  ) {
  }
  ngOnInit(): void {
    this.loadMenuItems();
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
        this.filteredItems = [...items];
        this.totalItems = items.length;
        this.filterItems();
        this.userCanAddMenu = this.getMenuCreateInfoForUser(items);
        this.sortData();
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

  // Pagination methods
  get paginatedItems(): IUserMenu[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.getPageCount()) {
      this.currentPage = page;
    }
  }

  changeItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    localStorage.setItem(ITEMS_PER_PAGE_KEY, itemsPerPage.toString());
    this.currentPage = 1;
  }

  getPageCount(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  goToPage() {
    const page = parseInt(this.pageInput as any);
    if (page >= 1 && page <= this.getPageCount()) {
      this.changePage(page);
    } else {
      this.pageInput = this.currentPage; // Reset to current page if invalid
    }
  }

  onPageInputChange(event: any) {
    const value = event.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      this.pageInput = value;
    }
  }

  // Sorting methods
  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  private sortData(): void {
    this.filteredItems.sort((a, b) => {
      // Handle undefined/null values
      const valA = a[this.sortColumn as keyof IUserMenu] ?? '';
      const valB = b[this.sortColumn as keyof IUserMenu] ?? '';

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (valA < valB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  getSortIcon(column: keyof IUserMenu): string {
    if (this.sortColumn !== column) {
      return 'bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
  }

  filterItems(): void {
    if (!this.searchTerm) {
      this.filteredItems = [...this.menuItems];
      this.totalItems = this.menuItems.length;
      this.currentPage = 1;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.menuItems.filter(item =>
      item.menuName.toLowerCase().includes(term) ||
      (item.menuPath && item.menuPath.toLowerCase().includes(term)) ||
      (item.menuIcon && item.menuIcon.toLowerCase().includes(term)) ||
      (item.menuCategory === 0 ? 'main' : 'master').includes(term)
    );

    this.totalItems = this.filteredItems.length;
    this.currentPage = 1; // Reset to first page after search
  }
}
