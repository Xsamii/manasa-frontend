import { Routes } from '@angular/router';

export const routes: Routes = [
  // Authentication Routes
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  
  // Main Application Routes (Protected)
  {
    path: '',
    loadChildren: () => import('./main/main.routes').then(m => m.mainRoutes)
  },
  
  // Wildcard route - 404 page
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];