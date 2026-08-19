import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  StatisticsService,
  TeacherCourseAnalytics,
} from '../shared/services/statistics.service';
import {
  ForumReport,
  ForumService,
} from '../shared/services/student-forum.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <section dir="rtl">
      <div class="mb-6">
        <h1 class="text-3xl font-bold">تحليلات المجتمع</h1>
        <p class="text-slate-500">تفاعل الطلاب، تقدم المشاهدة، وبلاغات المنتدى.</p>
      </div>
      <p *ngIf="error" class="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{{ error }}</p>
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <button *ngFor="let course of courses" class="card text-right" (click)="select(course)">
          <h2 class="font-bold text-lg">{{ course.title }}</h2>
          <div class="grid grid-cols-2 gap-2 text-sm mt-4">
            <span>الطلاب: {{ course.studentsCount }}</span>
            <span>النشطون: {{ course.activeStudents }}</span>
            <span>التقدم: {{ course.averageProgressPercentage }}%</span>
            <span>المشاهدة: {{ duration(course.totalWatchTimeSeconds) }}</span>
            <span>الموضوعات: {{ course.forumTopics }}</span>
            <span [class.text-red-700]="course.pendingReports">البلاغات: {{ course.pendingReports }}</span>
          </div>
        </button>
      </div>

      <div *ngIf="selected" class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">بلاغات {{ selected.title }}</h2>
          <button class="text-orange-700" (click)="loadReports()">تحديث</button>
        </div>
        <div *ngFor="let report of reports" class="border rounded-lg p-4 mb-3">
          <div class="flex justify-between text-sm">
            <strong>{{ report.targetType === 'topic' ? 'موضوع' : 'رد' }} #{{ report.targetId }}</strong>
            <span>{{ report.createdAt | date:'short' }}</span>
          </div>
          <p class="my-3">{{ report.reason }}</p>
          <div class="flex flex-wrap gap-2">
            <button class="danger" (click)="moderate(report, 'hide')">إخفاء</button>
            <button *ngIf="report.targetType === 'topic'" class="btn" (click)="moderate(report, 'lock')">قفل</button>
            <button class="btn" (click)="moderate(report, 'restore')">استعادة</button>
            <button class="muted" (click)="moderate(report, 'dismiss')">رفض البلاغ</button>
          </div>
        </div>
        <p *ngIf="!reports.length" class="text-center text-slate-500 py-8">لا توجد بلاغات معلقة.</p>
      </div>
    </section>
  `,
  styles: [`
    .card{display:block;width:100%;background:white;border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem}
    .card:hover{border-color:#fb923c}.btn,.muted,.danger{border-radius:.55rem;padding:.5rem .8rem}
    .btn{background:#334155;color:white}.muted{background:#e2e8f0}.danger{background:#b91c1c;color:white}
  `],
})
export class TeacherCommunityAnalyticsComponent implements OnInit {
  courses: TeacherCourseAnalytics[] = [];
  selected: TeacherCourseAnalytics | null = null;
  reports: ForumReport[] = [];
  error = '';

  constructor(
    private readonly statistics: StatisticsService,
    private readonly forum: ForumService,
  ) {}

  ngOnInit(): void {
    this.statistics.getTeacherCourses().subscribe({
      next: response => {
        if (response.success) this.courses = response.data;
      },
      error: error => this.error = error.error?.message ?? 'تعذر تحميل التحليلات.',
    });
  }

  select(course: TeacherCourseAnalytics): void {
    this.selected = course;
    this.loadReports();
  }

  loadReports(): void {
    if (!this.selected) return;
    this.forum.moderationQueue(this.selected.courseId).subscribe({
      next: response => {
        if (response.success) this.reports = response.data.items;
      },
      error: error => this.error = error.error?.message ?? 'تعذر تحميل البلاغات.',
    });
  }

  moderate(report: ForumReport, action: 'hide' | 'lock' | 'restore' | 'dismiss'): void {
    const reason = action === 'dismiss' ? undefined : prompt('ملاحظة الإشراف (اختياري)') ?? undefined;
    this.forum.moderate(report.id, action, reason).subscribe({
      next: () => {
        this.loadReports();
        this.ngOnInit();
      },
      error: error => this.error = error.error?.message ?? 'تعذر تنفيذ الإجراء.',
    });
  }

  duration(seconds: number): string {
    return `${Math.floor(seconds / 3600)}س ${Math.floor((seconds % 3600) / 60)}د`;
  }
}
