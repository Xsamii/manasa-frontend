import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { Course } from '../../../shared/models/course.model';
import { CourseService } from '../../../shared/services/course.service';
import { AppNotification, NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
     CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    BreadcrumbComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
breadcrumbItems = [
    { label: 'لوحة التحكم', isActive: true }
  ];

  enrolledCourses = 0;
  completedLessons = 0;
  recentCourses: Course[] = [];
  isLoadingCourses = true;
  coursesError = '';
  unreadNotifications = 0;
  recentNotifications: AppNotification[] = [];

  constructor(
    private courseService: CourseService,
    private readonly notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadNotifications();
  }

  loadCourses(): void {
    this.isLoadingCourses = true;
    this.coursesError = '';
    this.courseService.getMyCourses().subscribe({
      next: response => {
        if (!response.success) {
          this.coursesError = response.message;
          return;
        }
        this.enrolledCourses = response.data.length;
        this.completedLessons = response.data.reduce(
          (total, course) =>
            total + Math.round((course.lessonsCount * (course.progressPercentage || 0)) / 100),
          0,
        );
        this.recentCourses = response.data.slice(0, 3);
      },
      error: () => {
        this.coursesError = 'تعذر تحميل كورساتك حالياً.';
        this.isLoadingCourses = false;
      },
      complete: () => {
        this.isLoadingCourses = false;
      },
    });
  }

  loadNotifications(): void {
    this.notifications.unreadCount().subscribe({
      next: response => {
        if (response.success) this.unreadNotifications = response.data.count;
      },
    });
    this.notifications.list(1, 3).subscribe({
      next: response => {
        if (response.success) this.recentNotifications = response.data.items;
      },
    });
  }

  openNotification(item: AppNotification): void {
    if (!item.readAt) {
      this.notifications.markRead(item.id).subscribe({
        next: () => this.loadNotifications(),
      });
    }
    if (item.link) window.location.href = item.link;
  }
}