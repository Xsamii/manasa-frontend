import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { UserRole } from '../shared/models/user.model';

export const mainRoutes: Routes = [
  {
    path: 'teacher',
    canActivate: [AuthGuard],
    loadChildren: () => import('../teacher/teacher.routes').then(m => m.teacherRoutes),
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      // Dashboard/Home
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
        data: { roles: [UserRole.STUDENT] },
        loadComponent: () => import('./dashboard/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      
      // Courses
      {
        path: 'courses',
        loadChildren: () => import('./courses/courses.routes').then(m => m.coursesRoutes)
      },
      
      // Wallet & Financial
      {
        path: 'wallet',
        canActivate: [RoleGuard],
        data: { roles: [UserRole.STUDENT] },
        loadComponent: () => import('./my-wallet/my-wallet.component').then(c => c.MyWalletComponent)
      },
      {
        path: 'purchase-history',
        canActivate: [RoleGuard],
        data: { roles: [UserRole.STUDENT] },
        loadComponent: () => import('./purchase-history/purchase-history.component').then(c => c.PurchaseHistoryComponent)
      },
      {
        path: 'code-recharge',
        canActivate: [RoleGuard],
        data: { roles: [UserRole.STUDENT] },
        loadComponent: () => import('./code-recharge/code-recharge.component').then(c => c.CodeRechargeComponent)
      },
      
      // Subscriptions & Tracking
      {
        path: 'subscriptions',
        canActivate: [RoleGuard],
        data: { roles: [UserRole.STUDENT] },
        loadComponent: () => import('./subscriptions/subscriptions.component').then(c => c.SubscriptionsComponent)
      },
      {
        path: 'watching-details',
        canActivate: [RoleGuard],
        data: { roles: [UserRole.STUDENT] },
        loadComponent: () => import('./watching-details/watching-details.component').then(c => c.WatchingDetailsComponent)
      },
      
      // Statistics
      {
        path: 'statistics',
        loadChildren: () => import('./statistics/statistics.routes').then(m => m.statisticsRoutes)
      },
      
      // Assessments & Results
      {
        path: 'assessments',
        loadChildren: () => import('./assessment/assessment.routes').then(m => m.assessmentsRoutes)
      },
      
      // Forum
      {
        path: 'security',
        loadComponent: () => import('./security/security-sessions.component').then(c => c.SecuritySessionsComponent)
      },
      {
        path: 'forum',
        canActivate: [RoleGuard],
        data: { roles: [UserRole.STUDENT] },
        loadComponent: () => import('./student-forum/student-forum.component').then(c => c.StudentForumComponent)
      },
      
      // Default redirect
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
