import { Routes } from '@angular/router';
import { RoleGuard } from '../shared/guards/role.guard';
import { UserRole } from '../shared/models/user.model';

export const adminRoutes: Routes = [{
  path: '',
  canActivate: [RoleGuard],
  data: { roles: [UserRole.ADMIN] },
  loadComponent: () => import('./admin-layout.component').then(c => c.AdminLayoutComponent),
  children: [
    {
      path: '',
      loadComponent: () => import('./admin-dashboard.component').then(c => c.AdminDashboardComponent),
    },
  ],
}];
