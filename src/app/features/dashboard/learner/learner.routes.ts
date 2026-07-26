import { Routes } from '@angular/router';
export const LEARNER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/learner-home/learner-home').then((c) => c.LearnerHome),
  },
  {
    path: 'quizzes',
    loadComponent: () => import('./components/quizzes/quizzes').then((c) => c.Quizzes),
  },
  {
    path: 'results',
    loadComponent: () => import('./components/results/results').then((c) => c.Results),
  },
];
