import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'ingresar',
    loadComponent: () => import('@pages/login/login').then((m) => m.PageLogin),
  },
  {
    path: 'registrarse',
    loadComponent: () =>
      import('@pages/signup/signup').then((m) => m.PageSignup),
  },
  {
    path: 'recuperar-clave',
    loadComponent: () =>
      import('@pages/forgot-password/forgot-password').then(
        (m) => m.PageForgotPassword,
      ),
  },
  {
    path: 'nueva-clave',
    loadComponent: () =>
      import('@pages/new-password/new-password').then((m) => m.PageNewPassword),
  },
];
