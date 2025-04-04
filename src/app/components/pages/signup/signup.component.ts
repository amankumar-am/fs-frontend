import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }
  ngOnInit(): void {
    this.initializeForm();
    // this.checkEditMode();
  }

  private initializeForm() {
    this.signUpForm = this.fb.group({
      userID: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      loginID: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      reportingTo: ['', [Validators.required]],
      active: [{ value: true, disabled: true }],
      role: ['', [Validators.required]],
    });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      // Get raw value to include disabled fields
      const registerUserData = form.getRawValue();
      console.log(registerUserData);

      // this.addUser(productData);
    }

    // addUser(userData: productType) {
    //   this.isLoading = true;
    //   this.productService.createProduct(productData).subscribe({
    //     next: (response) => {
    //       this.isLoading = false;
    //       alert('Product added successfully!');
    //       this.productForm.reset();
    //       this.router.navigate(['/products/view']);
    //     },
    //     error: (error) => {
    //       this.isLoading = false;
    //       console.error('Error adding product:', error);
    //       alert('Failed to add product. Please try again.');
    //     }
    //   });
  }
}
