import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { PlatformStatistics, StatisticsService } from '../../../shared/services/statistics.service';

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
    enrolledCourses: 0,
    totalLectureTime: 0,
    totalVideoWatches: 0,
    completedLessons: 0,
    totalQuizOpens: 0,
    totalQuizCompletions: 0,
  };
  constructor(private readonly statisticsService: StatisticsService) {}


  isLoading = false;

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    
    this.statisticsService.getPlatformStatistics().subscribe({
      next: response => {
        if (response.success) this.statistics = response.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false,
    });
  }

  refreshStatistics(): void {
    this.loadStatistics();
  }

  // Helper methods for formatting
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} ساعة ${minutes} دقيقة`;
  }

  formatCount(count: number): string {
    return count === 0 ? '0 مرة' : `${count} مرة`;
  }

  // Method to get statistics summary for sharing or export
  getStatisticsSummary(): string {
    return `
إحصائياتك علي المنصة:
- إجمالي مدة فتح المحاضرات: ${this.formatTime(this.statistics.totalLectureTime)}
- إجمالي عدد مرات مشاهدة الفيديوهات: ${this.formatCount(this.statistics.totalVideoWatches)}
- إجمالي عدد مرات فتح الاختبار: ${this.formatCount(this.statistics.totalQuizOpens)}
- إجمالي عدد مرات إنهاء الاختبارات: ${this.formatCount(this.statistics.totalQuizCompletions)}
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