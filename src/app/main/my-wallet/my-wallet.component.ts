import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { TableColumn, TableComponent } from '../../shared/components/table/table.component';
import { WalletService } from '../../shared/services/wallet.service';

interface WalletTransaction {
  id: string;
  amount: string;
  status: 'تم الدفع' | 'لم يتم الدفع' | 'قيد المراجعة';
  date: Date;
  description?: string;
}

@Component({
  selector: 'app-my-wallet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    TableComponent,
    BreadcrumbComponent
  ],
  templateUrl: './my-wallet.component.html',
  styleUrl: './my-wallet.component.scss'
})
export class MyWalletComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'محفظتي', isActive: true }
  ];

  chargeForm!: FormGroup;
  isCharging = false;
  isLoadingTransactions = false;
  totalRecords = 0;
  balance = 0;
  currency = 'EGP';
  errorMessage = '';

  tableColumns: TableColumn[] = [
    { field: 'id', header: 'التسلسل', width: '100px' },
    { field: 'amount', header: 'إجمالي سعر المحتوية', width: '180px' },
    { field: 'status', header: 'حالة الدفع', type: 'badge', width: '140px' },
    { field: 'date', header: 'تاريخ العملية', type: 'date', width: '120px' }
  ];

  tableActions = [
    {
      icon: 'pi pi-eye',
      label: 'عرض التفاصيل',
      command: (data: any) => this.viewTransaction(data)
    },
    {
      icon: 'pi pi-download',
      label: 'تحميل الإيصال',
      command: (data: any) => this.downloadReceipt(data),
      visible: (data: any) => data.status === 'تم الدفع'
    }
  ];

  transactions: WalletTransaction[] = [];

  constructor(private fb: FormBuilder, private wallet: WalletService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadWallet();
  }

  private initializeForm(): void {
    this.chargeForm = this.fb.group({
      amount: ['', [
        Validators.required, 
        Validators.min(1), 
        Validators.pattern(/^\d+$/),
        Validators.max(10000) // Add max limit
      ]]
    });
  }

  onCharge(): void {
    this.errorMessage = 'الشحن المباشر غير متاح. استخدم كود شحن موثوق.';
  }

  loadWallet(): void {
    this.isLoadingTransactions = true;
    this.errorMessage = '';
    this.wallet.getBalance().subscribe({
      next: response => {
        if (response.success) {
          this.balance = response.data.balance;
          this.currency = response.data.currency;
        }
      },
      error: error => this.errorMessage = error.error?.message ?? 'تعذر تحميل الرصيد',
    });
    this.wallet.getTransactions().subscribe({
      next: response => {
        if (response.success) {
          this.transactions = response.data.items.map(item => ({
            id: item.id,
            amount: `${item.amount} ${item.currency}`,
            status: 'تم الدفع',
            date: new Date(item.createdAt),
            description: item.description,
          }));
          this.totalRecords = response.data.totalRecords;
        }
        this.isLoadingTransactions = false;
      },
      error: error => {
        this.errorMessage = error.error?.message ?? 'تعذر تحميل العمليات';
        this.isLoadingTransactions = false;
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.chargeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.chargeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'هذا الحقل مطلوب';
      if (field.errors['min']) return 'المبلغ يجب أن يكون أكبر من صفر';
      if (field.errors['max']) return 'المبلغ يجب أن يكون أقل من 10000 جنيه';
      if (field.errors['pattern']) return 'يرجى إدخال أرقام فقط';
    }
    return '';
  }

  viewTransaction(transaction: any): void {
    console.log('View transaction:', transaction);
    // Implement view transaction logic
    // You can navigate to a transaction details page or open a modal
  }

  downloadReceipt(transaction: any): void {
    console.log('Download receipt for:', transaction);
    // Implement receipt download logic
  }

  exportTransactions(): void {
    // Implement Excel export functionality
    console.log('Export transactions to Excel');
    
    const csvContent = this.generateCSV();
    this.downloadCSV(csvContent, 'wallet-transactions.csv');
  }

  private generateCSV(): string {
    const headers = ['التسلسل', 'المبلغ', 'حالة الدفع', 'تاريخ العملية'];
    const csvRows = [headers.join(',')];
    
    this.transactions.forEach(transaction => {
      const row = [
        transaction.id,
        transaction.amount,
        transaction.status,
        transaction.date.toLocaleDateString('ar-EG')
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  searchTransactions(searchTerm: string): void {
    console.log('Search transactions:', searchTerm);
    // The table component handles client-side search automatically
    // You can add custom search logic here if needed
  }
}