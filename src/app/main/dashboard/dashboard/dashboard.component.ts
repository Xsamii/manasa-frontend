import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { PageIntroComponent } from '../../../shared/components/page-intro/page-intro.component';
import { Course, Instructor } from '../../../shared/models/course.model';
import { CourseService } from '../../../shared/services/course.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AppNotification, NotificationService } from '../../../shared/services/notification.service';
import { studyYearLabel } from '../../../shared/models/study-year';
import { StudyYearPipe } from '../../../shared/pipes/study-year.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    BreadcrumbComponent,
    PageIntroComponent,
    StudyYearPipe,
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
  catalogCourses: Course[] = [];
  teachers: Instructor[] = [];
  isLoadingCourses = true;
  coursesError = '';
  unreadNotifications = 0;
  recentNotifications: AppNotification[] = [];

  constructor(
    private courseService: CourseService,
    private readonly notifications: NotificationService,
    readonly auth: AuthService,
  ) {}

  get studentName(): string {
    return this.auth.currentUser?.fullName || 'الطالب';
  }

  get welcomeLabel(): string {
    const user = this.auth.currentUser;
    const first = (user?.fullName || '').trim().split(/\s+/)[0] || this.studentName;
    return user?.gender === 'female' ? `الطالبة ${first}` : `الطالب ${first}`;
  }

  get studyYear(): string {
    return studyYearLabel(this.auth.currentUser?.studyYear);
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadNotifications();
  }

  loadCourses(): void {
    this.isLoadingCourses = true;
    this.coursesError = '';
    forkJoin({
      enrolled: this.courseService.getMyCourses(),
      available: this.courseService.getAvailableCourses(1, 8),
    }).subscribe({
      next: ({ enrolled, available }) => {
        if (!enrolled.success) {
          this.coursesError = enrolled.message;
          return;
        }
        this.enrolledCourses = enrolled.data.length;
        this.completedLessons = enrolled.data.reduce(
          (total, course) =>
            total + Math.round((course.lessonsCount * (course.progressPercentage || 0)) / 100),
          0,
        );
        this.recentCourses = enrolled.data.slice(0, 3);
        this.catalogCourses = available.success ? available.data.items.slice(0, 6) : [];
        const byId = new Map<number, Instructor>();
        [...enrolled.data, ...this.catalogCourses].forEach(course => {
          if (course.instructor && !byId.has(course.instructor.id)) {
            byId.set(course.instructor.id, course.instructor);
          }
        });
        this.teachers = [...byId.values()];
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
