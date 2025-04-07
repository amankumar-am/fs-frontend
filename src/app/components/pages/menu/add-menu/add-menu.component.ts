import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuService } from '../../../../services/api/menuService/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-menu',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-menu.component.html',
  styleUrl: './add-menu.component.css'
})
export class AddMenuComponent implements OnInit {
  menuForm!: FormGroup;
  isUpdate: boolean = false;
  constructor(private fb: FormBuilder, private menuService: MenuService) { }
  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.menuForm = this.fb.group({
      id: ['null'],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      path: ['', [Validators.required, Validators.maxLength(20)]],
      icon: ['', [Validators.required, Validators.maxLength(30)]],
      category: [null, Validators.required]
    })
  }
  onSubmit(form: FormGroup = this.menuForm) {
    if (form.valid) {
      const menuItem = form.value;
      this.menuService.createMenu(menuItem);
    } else {
      console.error('Form is invalid');
    }
  }
}
