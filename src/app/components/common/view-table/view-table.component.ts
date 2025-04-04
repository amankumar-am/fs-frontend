import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-table',
  imports: [CommonModule],
  templateUrl: './view-table.component.html',
  styleUrl: './view-table.component.css'
})
export class ViewTableComponent {
  headerItems: string[] = []
  menuItems: string[] = []
}
