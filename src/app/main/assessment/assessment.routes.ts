import { Routes } from '@angular/router';

export const assessmentsRoutes: Routes = [
  {
    path: 'custom-quiz',
    loadComponent: () => import('./create-custom-quiz/create-custom-quiz.component').then(c => c.CreateCustomQuizComponent)
  },
  {
    path: 'results',
    loadChildren: () => import('./results/results.routes').then(m => m.resultsRoutes)
  },
  {
    path: '',
    redirectTo: 'custom-quiz',
    pathMatch: 'full'
  }
];