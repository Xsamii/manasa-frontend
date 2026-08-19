import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { WalletService } from '../../shared/services/wallet.service';

interface Purchase {
  id: string;
  title: string;
  instructor: string;
  amount: number;
  time: string;
  date: Date;
  paymentMethod: string;
  hasImage: boolean;
  image?: string;
  status: string;
  isExpanded?: boolean; // Add expansion state
}

interface PurchaseGroup {
  date: string;
  purchases: Purchase[];
}

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent
  ],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss'
})
export class PurchaseHistoryComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'فواتيري', isActive: true }
  ];

  isLoading = false;
  purchases: Purchase[] = [];
  groupedPurchases: PurchaseGroup[] = [];
  errorMessage = '';

  constructor(private wallet: WalletService) {}

  ngOnInit(): void {
    this.loadPurchaseHistory();
  }

  loadPurchaseHistory(): void {
    this.isLoading = true;
    
    this.errorMessage = '';
    this.wallet.getPurchaseHistory().subscribe({
      next: response => {
        this.purchases = response.success ? response.data.map(item => {
          const date = new Date(item.createdAt);
          return {
            id: item.id,
            title: item.title,
            instructor: item.instructor ?? '',
            amount: item.amount,
            time: date.toLocaleTimeString('ar-EG'),
            date,
            paymentMethod: 'المحفظة',
            hasImage: true,
            status: item.status,
            isExpanded: false,
          };
        }) : [];
        this.groupPurchasesByDate();
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.error?.message ?? 'تعذر تحميل سجل المشتريات';
        this.isLoading = false;
      },
    });
  }
 
  groupPurchasesByDate(): void {
    const grouped: { [key: string]: Purchase[] } = {};
    
    this.purchases.forEach(purchase => {
      const dateKey = this.formatDate(purchase.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(purchase);
    });
    
    this.groupedPurchases = Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({
        date: this.formatDateHeader(date),
        purchases: grouped[date].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }));
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDateHeader(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('ar-EG', options);
  }

  getTotalAmount(purchases: Purchase[]): number {
    return purchases.reduce((total, purchase) => total + purchase.amount, 0);
  }

  togglePurchase(purchase: Purchase): void {
    purchase.isExpanded = !purchase.isExpanded;
  }

  viewPurchaseDetails(purchase: Purchase): void {
    console.log('View purchase details:', purchase);
    // Navigate to purchase details or open modal
  }

  downloadInvoice(purchase: Purchase): void {
    this.wallet.getReceipt(purchase.id).subscribe({
      next: response => {
        if (!response.success) return;
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: 'application/json;charset=utf-8;',
        });
        this.downloadBlob(blob, `receipt-${purchase.id}.json`);
      },
      error: error => this.errorMessage = error.error?.message ?? 'تعذر تحميل الإيصال',
    });
  }

  requestRefund(purchase: Purchase): void {
    console.log('Request refund for:', purchase);
    if (confirm(`هل تريد طلب استرداد للمشتريات بقيمة ${purchase.amount} جم؟`)) {
      // Process refund request
      alert('تم إرسال طلب الاسترداد وسيتم مراجعته');
    }
  }

  private generateInvoice(purchase: Purchase): void {
    const invoiceContent = `
فاتورة شراء

تفاصيل المشتريات:
- العنصر: ${purchase.title || 'عنصر متنوع'}
- المدرس: ${purchase.instructor || 'غير محدد'}
- المبلغ: ${purchase.amount} جم
- طريقة الدفع: ${purchase.paymentMethod}
- تاريخ الشراء: ${purchase.date.toLocaleDateString('ar-EG')}
- وقت الشراء: ${purchase.time}
- رقم المعاملة: ${purchase.id}

شكراً لك على الشراء!
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `invoice-${purchase.id}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  exportPurchaseHistory(): void {
    console.log('Export purchase history');
    
    const csvContent = this.generateCSV();
    this.downloadCSV(csvContent, 'purchase-history.csv');
  }

  private generateCSV(): string {
    const headers = ['التاريخ', 'الوقت', 'العنصر', 'المدرس', 'المبلغ', 'طريقة الدفع', 'الحالة'];
    const csvRows = [headers.join(',')];
    
    this.purchases.forEach(purchase => {
      const row = [
        purchase.date.toLocaleDateString('ar-EG'),
        purchase.time,
        purchase.title || 'عنصر متنوع',
        purchase.instructor || 'غير محدد',
        `${purchase.amount} جم`,
        purchase.paymentMethod,
        purchase.status
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

  private downloadBlob(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Analytics methods
  getTotalSpent(): number {
    return this.purchases.reduce((total, purchase) => total + purchase.amount, 0);
  }

  getAverageTransactionAmount(): number {
    if (this.purchases.length === 0) return 0;
    return Math.round(this.getTotalSpent() / this.purchases.length);
  }

  getMostUsedPaymentMethod(): string {
    const methodCounts: { [key: string]: number } = {};
    
    this.purchases.forEach(purchase => {
      methodCounts[purchase.paymentMethod] = (methodCounts[purchase.paymentMethod] || 0) + 1;
    });
    
    return Object.keys(methodCounts).reduce((a, b) => 
      methodCounts[a] > methodCounts[b] ? a : b
    );
  }

  getMonthlySpending(): { [key: string]: number } {
    const monthlySpending: { [key: string]: number } = {};
    
    this.purchases.forEach(purchase => {
      const monthKey = `${purchase.date.getFullYear()}-${purchase.date.getMonth() + 1}`;
      monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + purchase.amount;
    });
    
    return monthlySpending;
  }

  refreshPurchaseHistory(): void {
    this.loadPurchaseHistory();
  }
}