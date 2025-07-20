import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

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

  ngOnInit(): void {
    this.loadPurchaseHistory();
  }

  loadPurchaseHistory(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.purchases = [
        {
          id: '1',
          title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
          instructor: 'م/ محمد صلاح كرت',
          amount: 200,
          time: '1st September, 2021 at 11:30 PM',
          date: new Date('2021-09-01'),
          paymentMethod: 'شحن كود سحر',
          hasImage: true,
          image: 'assets/images/courses/course-1.jpg',
          status: 'completed',
          isExpanded: false
        },
        {
          id: '2',
          title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
          instructor: 'م/ محمد صلاح كرت',
          amount: 200,
          time: '1st September, 2021 at 11:43 PM',
          date: new Date('2021-09-01'),
          paymentMethod: 'Credit Card',
          hasImage: true,
          image: 'assets/images/courses/course-2.jpg',
          status: 'completed',
          isExpanded: false
        },
        {
          id: '3',
          title: '',
          instructor: '',
          amount: 200,
          time: '1st October, 2021 at 12:65 PM',
          date: new Date('2021-10-01'),
          paymentMethod: 'شحن كود سحر',
          hasImage: false,
          status: 'completed',
          isExpanded: false,
        },
        {
          id: '4',
          title: '',
          instructor: '',
          amount: 200,
          time: '1st September, 2021 at 11:44 PM',
          date: new Date('2021-09-01'),
          paymentMethod: 'شحن كود سحر',
          hasImage: false,
          status: 'completed'
        },
        {
          id: '5',
          title: '',
          instructor: '',
          amount: 200,
          time: '1st November, 2021 at 11:22 AM',
          date: new Date('2021-11-01'),
          paymentMethod: 'شحن كود سحر',
          hasImage: false,
          status: 'completed'
        }
      ];
      
      this.groupPurchasesByDate();
      this.isLoading = false;
    }, 1000);
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
    console.log('Download invoice for:', purchase);
    this.generateInvoice(purchase);
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