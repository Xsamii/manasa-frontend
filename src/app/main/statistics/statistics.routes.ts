import { Routes } from '@angular/router';
import { RoleGuard } from '../../shared/guards/role.guard';
import { UserRole } from '../../shared/models/user.model';

export const statisticsRoutes: Routes = [
  {
    path: 'platform',
    canActivate: [RoleGuard],
    data: { roles: [UserRole.STUDENT] },
    loadComponent: () => import('./platform-statistics/platform-statistics.component').then(c => c.PlatformStatisticsComponent)
  },
  {
    path: 'courses',
    canActivate: [RoleGuard],
    data: { roles: [UserRole.STUDENT] },
    loadComponent: () => import('./courses-statistics/courses-statistics.component').then(c => c.CoursesStatisticsComponent)
  },
  {
    path: '',
    redirectTo: 'platform',
    pathMatch: 'full'
  }
];