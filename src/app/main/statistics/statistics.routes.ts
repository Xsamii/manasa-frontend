import { Routes } from '@angular/router';

export const statisticsRoutes: Routes = [
  {
    path: 'platform',
    loadComponent: () => import('./platform-statistics/platform-statistics.component').then(c => c.PlatformStatisticsComponent)
  },
  {
    path: 'courses',
    loadComponent: () => import('./courses-statistics/courses-statistics.component').then(c => c.CoursesStatisticsComponent)
  },
  {
    path: '',
    redirectTo: 'platform',
    pathMatch: 'full'
  }
];