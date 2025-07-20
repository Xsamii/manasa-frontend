import { Routes } from '@angular/router';

export const coursesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./my-courses/my-courses.component').then(c => c.MyCoursesComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./courses-content/courses-content.component').then(c => c.CoursesContentComponent)
  }
];