import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { WalletService } from '../../shared/services/wallet.service';

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
  successMessage = '';

  breadcrumbItems = [
    { label: 'شحن كود جديد', isActive: true }
  ];

  constructor(private fb: FormBuilder, private wallet: WalletService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.rechargeForm = this.fb.group({
      rechargeCode: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  onCodeInput(event: any): void {
    const value = String(event.target.value).trimStart().toUpperCase();
    this.rechargeForm.patchValue({ rechargeCode: value }, { emitEvent: false });
    this.errorMessage = '';
    this.successMessage = '';
    this.isCodeInvalid = false;
  }

  onSubmit(): void {
    if (this.rechargeForm.valid && !this.isCodeInvalid) {
      this.isLoading = true;
      const code = this.rechargeForm.value.rechargeCode.trim();
      this.wallet.chargeWithCode(code).subscribe({
        next: response => {
          this.isLoading = false;
          if (!response.success) {
            this.errorMessage = response.message;
            this.isCodeInvalid = true;
            return;
          }
          this.successMessage = `تم الشحن بنجاح. الرصيد الحالي ${response.data.balance} ${response.data.currency}`;
          this.rechargeForm.reset();
        },
        error: error => {
          this.isLoading = false;
          this.isCodeInvalid = true;
          this.errorMessage = error.error?.message ?? 'تعذر شحن الكود. حاول مرة أخرى.';
        },
      });
    }
  }

  openQRScanner(): void {
    // Implement QR scanner functionality
    console.log('Opening QR scanner...');
    // You would integrate with a QR scanning library here
  }
}