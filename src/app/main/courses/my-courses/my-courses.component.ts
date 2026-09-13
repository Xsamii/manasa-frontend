import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { PageIntroComponent } from '../../../shared/components/page-intro/page-intro.component';
import { Course } from '../../../shared/models/course.model';
import { CourseService } from '../../../shared/services/course.service';
import { AuthService } from '../../../shared/services/auth.service';
import { StudyYearPipe } from '../../../shared/pipes/study-year.pipe';
import { mediaUrl } from '../../../shared/utils/media-url';

type CourseFilter = 'all' | 'my-courses';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent, StudyYearPipe, PageIntroComponent],
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private auth: AuthService,
  ) {}

  get isPublic(): boolean {
    return this.router.url.startsWith('/learn');
  }

  get showWelcome(): boolean {
    return this.route.snapshot.queryParamMap.get('welcome') === '1';
  }

  get welcomeName(): string {
    const user = this.auth.currentUser;
    const first = (user?.fullName || '').trim().split(/\s+/)[0];
    const prefix = user?.gender === 'female' ? 'الطالبة' : 'الطالب';
    return first ? `${prefix} ${first}` : prefix;
  }

  mediaUrl = mediaUrl;

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
    const enrolled$ = this.auth.isAuthenticated
      ? this.courseService.getMyCourses()
      : of({ success: true, data: [] as Course[] });
    forkJoin({
      available: this.courseService.getAvailableCourses(1, 50),
      enrolled: enrolled$,
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
    void this.router.navigate([this.isPublic ? '/learn' : '/courses', course.id]);
  }

  refreshCourses(): void {
    this.loadCourses();
  }
}
