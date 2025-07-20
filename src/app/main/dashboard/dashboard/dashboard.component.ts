import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

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
export class DashboardComponent {
breadcrumbItems = [
    { label: 'لوحة التحكم', isActive: true }
  ];

  walletBalance = 1453;
  enrolledCourses = 8;
  completedLessons = 24;
  studyHours = 45;

  recentCourses = [
    {
      id: '1',
      title: 'محاضرة الواجب اطلقها يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كتت',
      thumbnail: 'assets/images/course1.jpg',
      progress: 75
    },
    {
      id: '2',
      title: 'أساسيات الرياضيات',
      instructor: 'د/ أحمد محمود',
      thumbnail: 'assets/images/course2.jpg',
      progress: 45
    },
    {
      id: '3',
      title: 'الفيزياء المتقدمة',
      instructor: 'د/ سارة أحمد',
      thumbnail: 'assets/images/course3.jpg',
      progress: 20
    }
  ];

  ngOnInit(): void {
    // Load dashboard data
  }
}