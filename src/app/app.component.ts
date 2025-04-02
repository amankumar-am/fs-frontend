import { Component, OnInit } from '@angular/core';
import { UserDataService } from './services/api/userDataService/user-data.service'; // Import the data service
import { CommonModule } from '@angular/common';
import { RoleDataService } from './services/api/roleDataService/role-data.service';
import { MenuDataService } from './services/api/menuDataService/menu-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule]
})

export class AppComponent implements OnInit {
  userData: any[] = [];
  roleData: any[] = [];
  menuData: any[] = [];
  constructor(private userService: UserDataService, private roleService: RoleDataService, private menuService: MenuDataService) { }
  ngOnInit(): void {
    this.userService.getData().subscribe({
      next: (data) => {
        this.userData = data;
        console.log(this.userData);
      },
      error: (error) => {
        console.error('There was an error retrieving data:', error);
      }
    });
    this.roleService.getData().subscribe({
      next: (data: any) => {
        this.roleData = data;
        console.log(this.roleData);
      },
      error: (error) => {
        console.error('There was an error retrieving data:', error);
      }
    });
    this.menuService.getData().subscribe({
      next: (data) => {
        this.menuData = data;
        console.log(this.menuData);
      },
      error: (error) => {
        console.error('There was an error retrieving data:', error);
      }
    });
  }
}