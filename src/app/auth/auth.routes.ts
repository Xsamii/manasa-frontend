import { Routes } from '@angular/router';
import { GuestGuard } from '../shared/guards/guest.guard';

export const authRoutes: Routes = [
  {
    path: 'sign-up',
    canActivate: [GuestGuard],
    loadComponent: () => import('./sign-up/sign-up.component').then(c => c.SignUpComponent)
  },
  {
    path: 'sign-up-status',
    loadComponent: () => import('./sign-up-status/sign-up-status.component').then(c => c.SignUpStatusComponent)
  },
  {
    path: 'sign-in',
    canActivate: [GuestGuard],
    data: { role: 'student' },
    loadComponent: () => import('./sign-in/sign-in.component').then(c => c.SignInComponent)
  },
  {
    path: 'teacher-sign-in',
    canActivate: [GuestGuard],
    data: { role: 'teacher' },
    loadComponent: () => import('./sign-in/sign-in.component').then(c => c.SignInComponent)
  },
  {
    path: 'login',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in-status',
    loadComponent: () => import('./signin-status/signin-status.component').then(c => c.SigninStatusComponent)
  },
  {
    path: 'signin-status',
    redirectTo: 'sign-in-status',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  }
];