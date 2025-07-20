import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { TableColumn, TableComponent } from '../../shared/components/table/table.component';

interface Subscription {
  id: string;
  courseName: string;
  price: number;
  subscriptionType: 'إشتراكاتي' | 'يدوي';
  invoiceNumber: number;
}

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    BreadcrumbComponent
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'الإشتراكات', isActive: true }
  ];

  isLoadingSubscriptions = false;
  totalRecords = 0;

  tableColumns: TableColumn[] = [
    { field: 'id', header: 'التسلسل', width: '100px' },
    { field: 'courseName', header: 'اسم الكورس', width: '200px' },
    { field: 'price', header: 'السعر', width: '120px' },
    { field: 'subscriptionType', header: 'طريقة الإشتراك', type: 'badge', width: '150px' },
    { field: 'invoiceNumber', header: 'رقم الفاتورة', width: '120px' }
  ];

  tableActions = [
    {
      icon: 'pi pi-eye',
      label: 'عرض التفاصيل',
      command: (data: any) => this.viewSubscription(data)
    },
    {
      icon: 'pi pi-download',
      label: 'تحميل الفاتورة',
      command: (data: any) => this.downloadInvoice(data)
    },
    {
      icon: 'pi pi-refresh',
      label: 'تجديد الاشتراك',
      command: (data: any) => this.renewSubscription(data),
      visible: (data: any) => this.canRenew(data)
    }
  ];

  subscriptions: Subscription[] = [
    {
      id: '12323',
      courseName: 'دبلوم الوادي',
      price: 100,
      subscriptionType: 'إشتراكاتي',
      invoiceNumber: 190
    },
    {
      id: '3434',
      courseName: 'دبلوم الوادي',
      price: 150,
      subscriptionType: 'يدوي',
      invoiceNumber: 190
    },
    {
      id: '656456',
      courseName: 'دبلوم الوادي',
      price: 80,
      subscriptionType: 'إشتراكاتي',
      invoiceNumber: 180
    },
    {
      id: '12323',
      courseName: 'دبلوم الوادي',
      price: 150,
      subscriptionType: 'إشتراكاتي',
      invoiceNumber: 190
    },
    {
      id: '3434',
      courseName: 'دبلوم الوادي',
      price: 80,
      subscriptionType: 'إشتراكاتي',
      invoiceNumber: 190
    },
    {
      id: '656456',
      courseName: 'دبلوم الوادي',
      price: 150,
      subscriptionType: 'إشتراكاتي',
      invoiceNumber: 190
    },
    {
      id: '12323',
      courseName: 'دبلوم الوادي',
      price: 80,
      subscriptionType: 'إشتراكاتي',
      invoiceNumber: 190
    },
    {
      id: '656456',
      courseName: 'دبلوم الوادي',
      price: 150,
      subscriptionType: 'يدوي',
      invoiceNumber: 180
    },
    {
      id: '3434',
      courseName: 'دبلوم الوادي',
      price: 150,
      subscriptionType: 'يدوي',
      invoiceNumber: 180
    },
    {
      id: '656456',
      courseName: 'دبلوم الوادي',
      price: 80,
      subscriptionType: 'يدوي',
      invoiceNumber: 190
    }
  ];

  ngOnInit(): void {
    this.totalRecords = this.subscriptions.length;
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.isLoadingSubscriptions = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoadingSubscriptions = false;
    }, 1000);
  }

  viewSubscription(subscription: Subscription): void {
    console.log('View subscription:', subscription);
    // Navigate to subscription details page
    // this.router.navigate(['/subscriptions', subscription.id]);
  }

  downloadInvoice(subscription: Subscription): void {
    console.log('Download invoice for subscription:', subscription);
    // Implement invoice download logic
    this.generateAndDownloadInvoice(subscription);
  }

  renewSubscription(subscription: Subscription): void {
    console.log('Renew subscription:', subscription);
    // Implement subscription renewal logic
    if (confirm(`هل تريد تجديد اشتراك ${subscription.courseName}؟`)) {
      // Add renewal logic here
      alert('تم تجديد الاشتراك بنجاح');
    }
  }

  canRenew(subscription: Subscription): boolean {
    // Add logic to determine if subscription can be renewed
    // For example, check if subscription is expired or about to expire
    return Math.random() > 0.5; // Random for demo purposes
  }

  exportSubscriptions(): void {
    console.log('Export subscriptions to Excel');
    
    const csvContent = this.generateCSV();
    this.downloadCSV(csvContent, 'subscriptions.csv');
  }

  shareSubscriptions(): void {
    console.log('Share subscriptions');
    
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'اشتراكاتي',
        text: 'قائمة اشتراكاتي في المنصة',
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('تم نسخ الرابط إلى الحافظة');
      });
    }
  }

  searchSubscriptions(searchTerm: string): void {
    console.log('Search subscriptions:', searchTerm);
    // The table component handles client-side search automatically
    // You can add custom search logic here if needed
  }

  private generateCSV(): string {
    const headers = ['التسلسل', 'اسم الكورس', 'السعر', 'طريقة الإشتراك', 'رقم الفاتورة'];
    const csvRows = [headers.join(',')];
    
    this.subscriptions.forEach(subscription => {
      const row = [
        subscription.id,
        subscription.courseName,
        `${subscription.price} جم`,
        subscription.subscriptionType,
        subscription.invoiceNumber.toString()
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

  private generateAndDownloadInvoice(subscription: Subscription): void {
    // Generate invoice content
    const invoiceContent = `
فاتورة رقم: ${subscription.invoiceNumber}
اسم الكورس: ${subscription.courseName}
السعر: ${subscription.price} جم
طريقة الدفع: ${subscription.subscriptionType}
التاريخ: ${new Date().toLocaleDateString('ar-EG')}
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `invoice-${subscription.invoiceNumber}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}