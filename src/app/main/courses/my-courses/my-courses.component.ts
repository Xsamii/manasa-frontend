import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { Course } from '../../../shared/models/course.model';
import { CourseService } from '../../../shared/services/course.service';

type CourseFilter = 'all' | 'my-courses';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss'
})
export class MyCoursesComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'الكورسات', isActive: true }
  ];
  filterOptions: Array<{ label: string; value: CourseFilter }> = [
    { label: 'كل الكورسات', value: 'all' },
    { label: 'كورساتي', value: 'my-courses' }
  ];
  selectedFilter: CourseFilter = 'all';
  isLoading = false;
  errorMessage = '';
  searchQuery = '';
  allCourses: Course[] = [];
  myCourses: Course[] = [];
  filteredCourses: Course[] = [];
  purchasingCourseId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.searchQuery = (params.get('q') || '').trim().toLowerCase();
      this.applyFilter();
    });
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';
    forkJoin({
      available: this.courseService.getAvailableCourses(1, 50),
      enrolled: this.courseService.getMyCourses(),
    }).subscribe({
      next: ({ available, enrolled }) => {
        if (!available.success || !enrolled.success) {
          this.errorMessage = 'تعذر تحميل الكورسات حالياً.';
          return;
        }
        this.myCourses = enrolled.data;
        const enrolledById = new Map(this.myCourses.map(course => [course.id, course]));
        this.allCourses = available.data.items.map(course =>
          enrolledById.get(course.id) ?? course
        );
        this.applyFilter();
      },
      error: () => {
        this.errorMessage = 'تعذر الاتصال بالخادم. حاول مرة أخرى.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  setFilter(filter: CourseFilter): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    const source = this.selectedFilter === 'all' ? this.allCourses : this.myCourses;
    this.filteredCourses = this.searchQuery
      ? source.filter(course =>
          `${course.title} ${course.description} ${course.instructor?.name || ''}`
            .toLowerCase()
            .includes(this.searchQuery),
        )
      : source;
  }

  accessCourse(course: Course): void {
    if (course.isEnrolled) {
      void this.router.navigate(['/courses', course.id]);
      return;
    }
    this.enroll(course);
  }

  enroll(course: Course): void {
    this.errorMessage = '';
    this.purchasingCourseId = course.id;
    this.courseService.enrollInCourse(course.id).subscribe({
      next: response => {
        if (!response.success) {
          this.errorMessage = response.message;
          this.purchasingCourseId = null;
          return;
        }
        course.isEnrolled = true;
        if (!this.myCourses.some(item => item.id === course.id)) {
          this.myCourses = [...this.myCourses, course];
        }
        void this.router.navigate(['/courses', course.id]);
        this.purchasingCourseId = null;
      },
      error: error => {
        this.errorMessage = error.error?.message ?? 'تعذر إتمام التسجيل في الكورس.';
        this.purchasingCourseId = null;
      },
    });
  }

  refreshCourses(): void {
    this.loadCourses();
  }
}
