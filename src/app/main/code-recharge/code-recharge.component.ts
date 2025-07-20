import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-code-recharge',
  standalone: true,
  imports: [
      CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    BreadcrumbComponent
  ],
  templateUrl: './code-recharge.component.html',
  styleUrl: './code-recharge.component.scss'
})
export class CodeRechargeComponent {
rechargeForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  isCodeInvalid = false;

  breadcrumbItems = [
    { label: 'شحن كود جديد', isActive: true }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.rechargeForm = this.fb.group({
      rechargeCode: ['', [Validators.required, Validators.pattern(/^\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/)]]
    });
  }

  onCodeInput(event: any): void {
    let value = event.target.value.replace(/\s/g, ''); // Remove spaces
    
    // Only allow numbers
    value = value.replace(/[^\d]/g, '');
    
    // Limit to 11 digits
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Format with spaces (XX XX XX XX XX)
    let formattedValue = '';
    for (let i = 0; i < value.length; i += 2) {
      if (i > 0) formattedValue += ' ';
      formattedValue += value.substring(i, i + 2);
    }
    
    // Update form control
    this.rechargeForm.patchValue({
      rechargeCode: formattedValue
    });
    
    // Clear previous error
    this.errorMessage = '';
    this.isCodeInvalid = false;
    
    // Validate code length
    if (value.length === 11) {
      this.validateCode(value);
    }
  }

  private validateCode(code: string): void {
    // Example validation - you can customize this logic
    const invalidCodes = ['13185936432']; // Example invalid code from image
    
    if (invalidCodes.includes(code)) {
      this.errorMessage = 'لقد ادخلت كود شحن غير صحيح، برجاء التأكد و إعادة المحاولة';
      this.isCodeInvalid = true;
    } else {
      this.errorMessage = '';
      this.isCodeInvalid = false;
    }
  }

  onSubmit(): void {
    if (this.rechargeForm.valid && !this.isCodeInvalid) {
      this.isLoading = true;
      const code = this.rechargeForm.value.rechargeCode.replace(/\s/g, '');
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        
        // Check if code is valid (simulate server validation)
        if (code === '13185936432') {
          this.errorMessage = 'لقد ادخلت كود شحن غير صحيح، برجاء التأكد و إعادة المحاولة';
          this.isCodeInvalid = true;
        } else {
          // Success case
          console.log('Code recharged successfully:', code);
          alert('تم شحن الكود بنجاح!');
          this.rechargeForm.reset();
        }
      }, 2000);
    }
  }

  openQRScanner(): void {
    // Implement QR scanner functionality
    console.log('Opening QR scanner...');
    // You would integrate with a QR scanning library here
  }
}