import { Routes } from '@angular/router';
export const LEARNER_QUIZZES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/quiz-home/quiz-home').then((c) => c.QuizHome),
    data: {
      title: 'Quizzez',
    },
  },
  {
    path: ':id',
    loadComponent: () => import('./components/quiz-stepper/quiz-stepper').then((c) => c.QuizStepper),
    data: {
      title: 'Quiz',
    },
  },
];
