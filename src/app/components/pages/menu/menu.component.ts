import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../services/api/menuService/menu.service';
import { CommonModule } from '@angular/common';
import { IMenu } from '../../../interfaces/menu';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuItems: IMenu[] = [];

  constructor(private menuService: MenuService, private router: Router) {
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
}
