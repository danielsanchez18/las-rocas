import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@routes/landing.routes').then((m) => m.LANDING_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@routes/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
