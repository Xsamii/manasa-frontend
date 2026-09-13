import { Routes } from '@angular/router';
import { HomeGuard } from './shared/guards/home.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [HomeGuard],
    loadComponent: () => import('./public/landing/landing.component').then(c => c.LandingComponent),
  },
  {
    path: 'learn',
    loadComponent: () => import('./main/courses/my-courses/my-courses.component').then(c => c.MyCoursesComponent),
  },
  {
    path: 'learn/:id',
    loadComponent: () => import('./main/courses/courses-content/courses-content.component').then(c => c.CoursesContentComponent),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./main/main.routes').then(m => m.mainRoutes)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
