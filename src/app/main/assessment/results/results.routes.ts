import { Routes } from '@angular/router';

export const resultsRoutes: Routes = [
  {
    path: 'center',
    loadComponent: () => import('./center-results/center-results.component').then(c => c.CenterResultsComponent)
  },
  {
    path: 'exams',
    loadComponent: () => import('./exam-results/exam-results.component').then(c => c.ExamResultsComponent)
  },
  {
    path: 'homework',
    loadComponent: () => import('./homework-results/homework-results.component').then(c => c.HomeworkResultsComponent)
  },
  {
    path: '',
    redirectTo: 'center',
    pathMatch: 'full'
  }
];