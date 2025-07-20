import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';


interface PlatformStatistics {
  lectureTime: string;
  videoViews: number;
  quizOpening: number;
  testCompletion: number;
}

@Component({
  selector: 'app-platform-statistics',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent
  ],
  templateUrl: './platform-statistics.component.html',
  styleUrl: './platform-statistics.component.scss'
})
export class PlatformStatisticsComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'إحصائياتك علي المنصة', isActive: true }
  ];

  statistics: PlatformStatistics = {
    lectureTime: 'ساعتان',
    videoViews: 34,
    quizOpening: 0,
    testCompletion: 0
  };

  isLoading = false;

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // In real implementation, you would fetch data from API
      // this.statisticsService.getPlatformStatistics().subscribe(data => {
      //   this.statistics = data;
      //   this.isLoading = false;
      // });
      
      this.isLoading = false;
    }, 1000);
  }

  refreshStatistics(): void {
    this.loadStatistics();
  }

  // Helper methods for formatting
  formatTime(timeString: string): string {
    return timeString;
  }

  formatCount(count: number): string {
    return count === 0 ? '0 مرة' : `${count} مرة`;
  }

  // Method to get statistics summary for sharing or export
  getStatisticsSummary(): string {
    return `
إحصائياتك علي المنصة:
- إجمالي مدة فتح المحاضرات: ${this.statistics.lectureTime}
- إجمالي عدد مرات مشاهدة الفيديوهات: ${this.formatCount(this.statistics.videoViews)}
- إجمالي عدد مرات فتح الاختبار: ${this.formatCount(this.statistics.quizOpening)}
- إجمالي عدد مرات إنهاء الاختبارات: ${this.formatCount(this.statistics.testCompletion)}
    `;
  }

  shareStatistics(): void {
    const summary = this.getStatisticsSummary();
    
    if (navigator.share) {
      navigator.share({
        title: 'إحصائياتي علي المنصة',
        text: summary,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(summary).then(() => {
        alert('تم نسخ الإحصائيات إلى الحافظة');
      });
    }
  }

  exportStatistics(): void {
    const summary = this.getStatisticsSummary();
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'platform-statistics.txt');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}