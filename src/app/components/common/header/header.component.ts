import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, IUser } from '../../../services/auth/auth.service';
import { MenuStateService } from '../../../services/api/menuService/menu-state.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(public authService: AuthService, private menuState: MenuStateService) { }

  isCollapsed: boolean = true

  user: IUser = {};

  ngOnInit(): void {
    this.setupUserSubscription();

  }

  private setupUserSubscription(): void {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(userData => {
      this.user = {
        USM_Name: userData?.USM_Name?.trim() || "",
        USM_Email: userData?.USM_Email?.trim() || "",
        USM_ProfileImage: userData?.USM_ProfileImage || ''
      };
    });
  }




}