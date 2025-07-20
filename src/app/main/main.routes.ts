import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

export const mainRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    // canActivate: [AuthGuard], // Protect all main routes
    children: [
      // Dashboard/Home
      {
        path: 'dashboard',
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
        loadComponent: () => import('./my-wallet/my-wallet.component').then(c => c.MyWalletComponent)
      },
      {
        path: 'purchase-history',
        loadComponent: () => import('./purchase-history/purchase-history.component').then(c => c.PurchaseHistoryComponent)
      },
      {
        path: 'code-recharge',
        loadComponent: () => import('./code-recharge/code-recharge.component').then(c => c.CodeRechargeComponent)
      },
      
      // Subscriptions & Tracking
      {
        path: 'subscriptions',
        loadComponent: () => import('./subscriptions/subscriptions.component').then(c => c.SubscriptionsComponent)
      },
      {
        path: 'watching-details',
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
        path: 'forum',
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
