import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuService } from '../../../../services/api/menuService/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IMenu } from '../../../../interfaces/menu';
import { CommonModule } from '@angular/common';
import { MenuStateService } from '../../../../services/api/menuService/menu-state.service';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddMenuComponent implements OnInit {
  menuForm!: FormGroup;
  isUpdate = false;
  menuId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private menuStateService: MenuStateService
  ) {
    this.menuForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      path: ['', [Validators.required, Validators.maxLength(255)]],
      icon: ['', [Validators.required, Validators.maxLength(100)]],
      category: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkForEdit();
  }

  private checkForEdit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isUpdate = true;
        this.menuId = +params['id'];
        this.loadMenuData(this.menuId);
      }
    });

    // Check for state data if coming from navigation
    const state = history.state;
    if (state && state['itemData']) {
      this.isUpdate = true;
      this.populateForm(state['itemData']);
    }
  }

  private loadMenuData(id: number): void {
    this.isLoading = true;
    this.menuService.getMenuItem(id).subscribe({
      next: (menu: IMenu) => {
        this.populateForm(menu);
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load menu data');
        console.error(err);
        this.isLoading = false;
        this.router.navigate(['/menu']);
      }
    });
  }

  private populateForm(menu: IMenu): void {
    this.menuForm.patchValue({
      id: menu.id,
      name: menu.name,
      path: menu.path,
      icon: menu.icon,
      category: menu.category?.toString()
    });
  }

  onSubmit(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields correctly');
      return;
    }

    this.isLoading = true;
    const formData = this.menuForm.value;
    const menuData: IMenu = {
      id: formData.id,
      name: formData.name,
      path: formData.path,
      icon: formData.icon,
      category: formData.category
    };

    const operation = this.isUpdate && this.menuId
      ? this.menuService.updateMenu(this.menuId, menuData)
      : this.menuService.createMenu(menuData);

    operation.subscribe({
      next: () => {
        const message = this.isUpdate ? 'Menu updated successfully' : 'Menu created successfully';
        this.toastr.success(message);
        this.router.navigate(['/menu']);
        this.menuStateService.notifyMenuUpdated();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Operation failed');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/menu']);
  }
}