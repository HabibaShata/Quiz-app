import { Routes } from '@angular/router';
export const RESULTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/results-list/results-list').then((c) => c.ResultsList),
    data: {
      title: 'Results',
    },
  },
  {
    path: 'view-quiz/:id',
    loadComponent: () =>
      import('./components/view-result/view-result').then(
        (c) => c.ViewResult,
      ),
    data: {
      title: 'View Result',
    },
  },
];
