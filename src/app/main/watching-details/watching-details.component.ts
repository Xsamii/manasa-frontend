import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { TableColumn, TableComponent } from '../../shared/components/table/table.component';

interface WatchingDetail {
  id: string;
  videoTitle: string;
  courseName: string;
  watchDuration: string;
  watchDate: Date;
}

@Component({
  selector: 'app-watching-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    BreadcrumbComponent
  ],
  templateUrl: './watching-details.component.html',
  styleUrl: './watching-details.component.scss'
})
export class WatchingDetailsComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'تفاصيل المشاهدات', isActive: true }
  ];

  isLoadingWatchingDetails = false;
  totalRecords = 0;

  tableColumns: TableColumn[] = [
    { field: 'id', header: 'التسلسل', width: '100px' },
    { field: 'videoTitle', header: 'اسم الفيديو', width: '200px' },
    { field: 'courseName', header: 'اسم الكورس', width: '180px' },
    { field: 'watchDuration', header: 'مدة المشاهدة', width: '140px', type: 'badge' },
    { field: 'watchDate', header: 'تاريخ المشاهدة', width: '140px', type: 'date' }
  ];

  tableActions = [
    {
      icon: 'pi pi-play',
      label: 'مشاهدة الفيديو',
      command: (data: any) => this.watchVideo(data)
    },
    {
      icon: 'pi pi-eye',
      label: 'عرض التفاصيل',
      command: (data: any) => this.viewDetails(data)
    },
    {
      icon: 'pi pi-bookmark',
      label: 'إضافة للمفضلة',
      command: (data: any) => this.addToFavorites(data)
    }
  ];

  watchingDetails: WatchingDetail[] = [
    {
      id: '12323',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    },
    {
      id: '3434',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    },
    {
      id: '656456',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    },
    {
      id: '12323',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    },
    {
      id: '3434',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    },
    {
      id: '656456',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    },
    {
      id: '12323',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    },
    {
      id: '656456',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    },
    {
      id: '3434',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    },
    {
      id: '656456',
      videoTitle: 'دبلوم الوادي',
      courseName: 'دبلوم الوادي',
      watchDuration: 'لم يتم تشغيل الفيديو',
      watchDate: new Date('2025-11-05')
    }
  ];

  ngOnInit(): void {
    this.totalRecords = this.watchingDetails.length;
    this.loadWatchingDetails();
  }

  loadWatchingDetails(): void {
    this.isLoadingWatchingDetails = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoadingWatchingDetails = false;
    }, 1000);
  }

  watchVideo(detail: WatchingDetail): void {
    console.log('Watch video:', detail);
    // Navigate to video player or open video modal
    // this.router.navigate(['/video', detail.id]);
    alert(`بدء تشغيل: ${detail.videoTitle}`);
  }

  viewDetails(detail: WatchingDetail): void {
    console.log('View details:', detail);
    // Navigate to detailed view or open modal
    // this.router.navigate(['/watching-details', detail.id]);
  }

  addToFavorites(detail: WatchingDetail): void {
    console.log('Add to favorites:', detail);
    // Implement add to favorites logic
    alert(`تم إضافة "${detail.videoTitle}" إلى المفضلة`);
  }

  exportWatchingDetails(): void {
    console.log('Export watching details to Excel');
    
    const csvContent = this.generateCSV();
    this.downloadCSV(csvContent, 'watching-details.csv');
  }

  shareWatchingDetails(): void {
    console.log('Share watching details');
    
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'تفاصيل مشاهداتي',
        text: 'قائمة تفاصيل مشاهداتي في المنصة',
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('تم نسخ الرابط إلى الحافظة');
      });
    }
  }

  searchWatchingDetails(searchTerm: string): void {
    console.log('Search watching details:', searchTerm);
    // The table component handles client-side search automatically
    // You can add custom search logic here if needed
  }

  private generateCSV(): string {
    const headers = ['التسلسل', 'اسم الفيديو', 'اسم الكورس', 'مدة المشاهدة', 'تاريخ المشاهدة'];
    const csvRows = [headers.join(',')];
    
    this.watchingDetails.forEach(detail => {
      const row = [
        detail.id,
        detail.videoTitle,
        detail.courseName,
        detail.watchDuration,
        detail.watchDate.toLocaleDateString('ar-EG')
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
}