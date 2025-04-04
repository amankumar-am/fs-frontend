import { Component } from '@angular/core';
import { RoleService, RoleType } from '../../../services/api/roleService/role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role',
  imports: [CommonModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleItems: RoleType[] = [];

  constructor(private roleService: RoleService) {
  }
  ngOnInit(): void {
    this.roleService.getRoleItems().subscribe((items) => {
      this.roleItems = items;
    });
  }
}
