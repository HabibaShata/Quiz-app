import { Routes } from '@angular/router';
export const LEARNER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/learner-home/learner-home').then((c) => c.LearnerHome),
  },
  {
    path: 'quizzes',
    loadComponent: () => import('./modules/exams/components/exam-stepper/exam-stepper').then((c) => c.ExamStepper),
  },
  {
    path: 'results',
    loadComponent: () => import('./modules/learner-results/components/learner-resaults-list/learner-resaults-list').then((c) => c.LearnerResaultsList),
  },
];
