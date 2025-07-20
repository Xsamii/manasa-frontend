import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up.component').then(c => c.SignUpComponent)
  },
  {
    path: 'sign-up-status',
    loadComponent: () => import('./sign-up-status/sign-up-status.component').then(c => c.SignUpStatusComponent)
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./sign-in/sign-in.component').then(c => c.SignInComponent)
  },
  {
    path: 'signin-status',
    loadComponent: () => import('./signin-status/signin-status.component').then(c => c.SigninStatusComponent)
  },
  {
    path: '',
    redirectTo: 'sign-up',
    pathMatch: 'full'
  }
];