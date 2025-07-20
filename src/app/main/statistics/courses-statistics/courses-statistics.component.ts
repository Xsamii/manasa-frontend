import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

interface CourseStatistics {
  videosWatched: number;
  totalVideos: number;
  testsCompleted: number;
  totalTests: number;
  highestScore: number;
  maxScore: number;
}

@Component({
  selector: 'app-courses-statistics',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent
  ],
  templateUrl: './courses-statistics.component.html',
  styleUrl: './courses-statistics.component.scss'
})
export class CoursesStatisticsComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'إحصائيات كورساتك', isActive: true }
  ];

  statistics: CourseStatistics = {
    videosWatched: 49,
    totalVideos: 129,
    testsCompleted: 15,
    totalTests: 129,
    highestScore: 95,
    maxScore: 100
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
      // this.statisticsService.getCoursesStatistics().subscribe(data => {
      //   this.statistics = data;
      //   this.isLoading = false;
      // });
      
      this.isLoading = false;
    }, 1000);
  }

  // Calculate percentages
  getVideosWatchedPercentage(): number {
    return Math.round((this.statistics.videosWatched / this.statistics.totalVideos) * 100);
  }

  getTestsCompletedPercentage(): number {
    return Math.round((this.statistics.testsCompleted / this.statistics.totalTests) * 100);
  }

  getHighestScorePercentage(): number {
    return Math.round((this.statistics.highestScore / this.statistics.maxScore) * 100);
  }

  // SVG Circle calculations
  getCircumference(): number {
    const radius = 88; // Same as the r attribute in SVG
    return 2 * Math.PI * radius;
  }

  getStrokeDashoffset(percentage: number): number {
    const circumference = this.getCircumference();
    return circumference - (percentage / 100) * circumference;
  }

  // Helper methods for formatting
  formatVideoCount(watched: number, total: number): string {
    return `${watched} فيديو من ${total}`;
  }

  formatTestCount(completed: number, total: number): string {
    return `${completed} فيديو من ${total}`;
  }

  formatScore(score: number, maxScore: number): string {
    return `${score} درجة من ${maxScore}`;
  }

  // Method to get statistics summary
  getStatisticsSummary(): string {
    return `
إحصائيات كورساتك:
- عدد الفيديوهات المشاهدة: ${this.statistics.videosWatched} من ${this.statistics.totalVideos} (${this.getVideosWatchedPercentage()}%)
- عدد الاختبارات المكتملة: ${this.statistics.testsCompleted} من ${this.statistics.totalTests} (${this.getTestsCompletedPercentage()}%)
- أعلى درجة محققة: ${this.statistics.highestScore} من ${this.statistics.maxScore} (${this.getHighestScorePercentage()}%)
    `;
  }

  shareStatistics(): void {
    const summary = this.getStatisticsSummary();
    
    if (navigator.share) {
      navigator.share({
        title: 'إحصائيات كورساتي',
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
      link.setAttribute('download', 'courses-statistics.txt');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  refreshStatistics(): void {
    this.loadStatistics();
  }

  // Navigation methods
  goToVideos(): void {
    // Navigate to videos page
    // this.router.navigate(['/courses/videos']);
  }

  goToTests(): void {
    // Navigate to tests page
    // this.router.navigate(['/assessments']);
  }

  goToScores(): void {
    // Navigate to scores page
    // this.router.navigate(['/assessments/results']);
  }
}