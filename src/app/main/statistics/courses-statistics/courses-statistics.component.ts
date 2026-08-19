import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { CourseStatistics, StatisticsService } from '../../../shared/services/statistics.service';

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
    videosWatched: 0,
    totalVideos: 0,
    videosPercentage: 0,
    testsCompleted: 0,
    totalTests: 0,
    testsPercentage: 0,
    highestScore: 0,
    maxScore: 0,
    scorePercentage: 0,
  };
  constructor(private readonly statisticsService: StatisticsService) {}


  isLoading = false;

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    
    this.statisticsService.getCourseStatistics().subscribe({
      next: response => {
        if (response.success) this.statistics = response.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false,
    });
  }

  // Calculate percentages
  getVideosWatchedPercentage(): number {
    return this.statistics.videosPercentage;
  }

  getTestsCompletedPercentage(): number {
    return this.statistics.testsPercentage;
  }

  getHighestScorePercentage(): number {
    return this.statistics.scorePercentage;
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