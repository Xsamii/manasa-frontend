import { Routes } from '@angular/router';

export const resultsRoutes: Routes = [
  {
    path: 'center',
    loadComponent: () => import('../assessment-results.component').then(c => c.AssessmentResultsComponent)
  },
  {
    path: 'exams',
    data: { type: 'test' },
    loadComponent: () => import('../assessment-results.component').then(c => c.AssessmentResultsComponent)
  },
  {
    path: 'homework',
    data: { type: 'homework' },
    loadComponent: () => import('../assessment-results.component').then(c => c.AssessmentResultsComponent)
  },
  {
    path: '',
    redirectTo: 'center',
    pathMatch: 'full'
  }
];