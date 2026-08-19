import { Routes } from '@angular/router';
import { RoleGuard } from '../../shared/guards/role.guard';
import { UserRole } from '../../shared/models/user.model';

export const assessmentsRoutes: Routes = [
  {
    path: 'custom-quiz',
    canActivate: [RoleGuard],
    data: { roles: [UserRole.STUDENT] },
    loadComponent: () => import('./create-custom-quiz/create-custom-quiz.component').then(c => c.CreateCustomQuizComponent)
  },
  {
    path: 'results',
    canActivate: [RoleGuard],
    data: { roles: [UserRole.STUDENT] },
    loadChildren: () => import('./results/results.routes').then(m => m.resultsRoutes)
  },
  {
    path: 'test/:id',
    canActivate: [RoleGuard],
    data: { roles: [UserRole.STUDENT] },
    loadComponent: () => import('./student-test.component').then(c => c.StudentTestComponent)
  },
  {
    path: 'homework/:id',
    canActivate: [RoleGuard],
    data: { roles: [UserRole.STUDENT] },
    loadComponent: () => import('./student-homework.component').then(c => c.StudentHomeworkComponent)
  },
  {
    path: '',
    redirectTo: 'custom-quiz',
    pathMatch: 'full'
  }
];