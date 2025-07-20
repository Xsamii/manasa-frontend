import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

interface Course {
  id: string;
  title: string;
  instructor: string;
  subject: string;
  type: string;
  date: string;
  image: string;
  subscriptionType: 'all' | 'my-courses' | 'free';
  isAccessible: boolean;
}

interface FilterOption {
  label: string;
  value: 'all' | 'my-courses' | 'free';
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent
  ],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss'
})
export class MyCoursesComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'كورساتي', isActive: true }
  ];

  filterOptions: FilterOption[] = [
    { label: 'كل الإشتراكات', value: 'all' },
    { label: 'كورساتي', value: 'my-courses' },
    { label: 'مجاني', value: 'free' }
  ];

  selectedFilter: 'all' | 'my-courses' | 'free' = 'all';
  isLoading = false;
  hasMoreCourses = true;
  currentPage = 1;

  allCourses: Course[] = [
    {
      id: '1',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'MATH',
      type: 'الرياضة',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/math-course.jpg',
      subscriptionType: 'my-courses',
      isAccessible: true
    },
    {
      id: '2',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'العربية',
      type: 'اللغة العربية',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/arabic-course.jpg',
      subscriptionType: 'my-courses',
      isAccessible: true
    },
    {
      id: '3',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'كيمياء',
      type: 'الكيمياء',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/chemistry-course.jpg',
      subscriptionType: 'my-courses',
      isAccessible: true
    },
    {
      id: '4',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'اللغة الفرنسية',
      type: 'الفرنسية',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/french-course.jpg',
      subscriptionType: 'free',
      isAccessible: true
    },
    {
      id: '5',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'اللغة الفرنسية',
      type: 'الفرنسية',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/french-course-2.jpg',
      subscriptionType: 'free',
      isAccessible: true
    },
    // Second row - duplicated for demo
    {
      id: '6',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'MATH',
      type: 'الرياضة',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/math-course.jpg',
      subscriptionType: 'my-courses',
      isAccessible: true
    },
    {
      id: '7',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'العربية',
      type: 'اللغة العربية',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/arabic-course.jpg',
      subscriptionType: 'my-courses',
      isAccessible: true
    },
    {
      id: '8',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'كيمياء',
      type: 'الكيمياء',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/chemistry-course.jpg',
      subscriptionType: 'free',
      isAccessible: true
    },
    {
      id: '9',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'اللغة الفرنسية',
      type: 'الفرنسية',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/french-course.jpg',
      subscriptionType: 'my-courses',
      isAccessible: true
    },
    {
      id: '10',
      title: 'محاضرة الواجب ( طلبة يوم الأحد - المراجعة 5',
      instructor: 'م/ محمد صلاح كرت',
      subject: 'اللغة الفرنسية',
      type: 'الفرنسية',
      date: 'الأحد 11 مايو 2025',
      image: 'assets/images/courses/french-course-2.jpg',
      subscriptionType: 'free',
      isAccessible: true
    }
  ];

  filteredCourses: Course[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.applyFilter();
      this.isLoading = false;
    }, 1000);
  }

  setFilter(filter: 'all' | 'my-courses' | 'free'): void {
    this.selectedFilter = filter;
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    let allFilteredCourses: Course[] = [];
    
    if (this.selectedFilter === 'all') {
      allFilteredCourses = [...this.allCourses];
    } else {
      allFilteredCourses = this.allCourses.filter(
        course => course.subscriptionType === this.selectedFilter
      );
    }
    
    // Reset to show only first 2 rows (10 courses) initially
    this.currentPage = 1;
    const coursesPerLoad = 10; // Approximately 2 rows (5 cards per row)
    const startIndex = 0;
    const endIndex = coursesPerLoad;
    
    this.filteredCourses = allFilteredCourses.slice(startIndex, endIndex);
    
    // Check if there are more courses to load
    this.hasMoreCourses = allFilteredCourses.length > coursesPerLoad;
  }

  loadMoreCourses(): void {
    this.isLoading = true;
    
    // Simulate loading more courses
    setTimeout(() => {
      let allFilteredCourses: Course[] = [];
      
      if (this.selectedFilter === 'all') {
        allFilteredCourses = [...this.allCourses];
      } else {
        allFilteredCourses = this.allCourses.filter(
          course => course.subscriptionType === this.selectedFilter
        );
      }
      
      this.currentPage++;
      const coursesPerLoad = 8; // Load 2 more rows (10 more courses)
      const startIndex = (this.currentPage - 1) * coursesPerLoad;
      const endIndex = startIndex + coursesPerLoad;
      
      // Add new courses to existing ones
      const newCourses = allFilteredCourses.slice(startIndex, endIndex);
      this.filteredCourses = [...this.filteredCourses, ...newCourses];
      
      // Check if there are more courses to load
      this.hasMoreCourses = endIndex < allFilteredCourses.length;
      
      this.isLoading = false;
    }, 800);
  }

  getCourseTypeClass(type: string): string {
    const typeMap: { [key: string]: string } = {
      'الرياضة': 'badge-math',
      'اللغة العربية': 'badge-arabic',
      'الكيمياء': 'badge-chemistry',
      'الفرنسية': 'badge-french',
      'الإنجليزية': 'badge-english'
    };
    
    return typeMap[type] || 'badge-math';
  }

  accessCourse(course: Course): void {
    if (course.isAccessible) {
      console.log('Accessing course:', course);
      // Navigate to course details or video player
      this.router.navigate(['/courses', course.id]);
    } else {
      // Show subscription required message
      alert('يتطلب الاشتراك في الكورس للوصول إلى المحتوى');
    }
  }

  shareCourse(course: Course): void {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: `شاهد كورس ${course.title} مع ${course.instructor}`,
        url: `${window.location.origin}/courses/${course.id}`
      }).catch(console.error);
    } else {
      // Fallback: copy link to clipboard
      const url = `${window.location.origin}/courses/${course.id}`;
      navigator.clipboard.writeText(url).then(() => {
        alert('تم نسخ رابط الكورس إلى الحافظة');
      });
    }
  }

  addToFavorites(course: Course): void {
    console.log('Add to favorites:', course);
    // Implement add to favorites logic
    alert(`تم إضافة "${course.title}" إلى المفضلة`);
  }

  refreshCourses(): void {
    this.currentPage = 1;
    this.hasMoreCourses = true;
    this.loadCourses();
  }
}