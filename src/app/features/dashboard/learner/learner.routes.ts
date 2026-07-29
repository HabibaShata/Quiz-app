import { Routes } from '@angular/router';
export const LEARNER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/learner-home/learner-home').then((c) => c.LearnerHome),
  },
   {
    path: 'quizzes',
    loadChildren: () => import('../learner/modules/learner-quiz/learner-quizzes.route').then((r) => r.LEARNER_QUIZZES_ROUTES),
  },
  {
    path: 'results',
    loadComponent: () => import('./modules/learner-results/components/learner-resaults-list/learner-resaults-list').then((c) => c.LearnerResaultsList),
  },
];
