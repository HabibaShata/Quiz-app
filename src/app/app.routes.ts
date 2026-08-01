import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { RoleEnum } from './core/enum/role.enum';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.Auth_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  {
    canActivate: [authGuard, roleGuard([RoleEnum.Student])],
    path: 'current-quiz/:id',
    title: 'Current Quiz',
    loadComponent: () =>
      import('./features/dashboard/learner/modules/learner-quiz/components/quiz-stepper/quiz-stepper').then((m) => m.QuizStepper),
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () =>
      import('./shared/components/general/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
