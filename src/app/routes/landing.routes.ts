import { Routes } from '@angular/router';
import { LayoutLanding } from '@layouts/landing/landing';

export const LANDING_ROUTES: Routes = [
  {
    path: '',
    component: LayoutLanding,
    children: [
      {
        path: '',
        loadComponent: () => import('@pages/home/home').then((m) => m.PageHome),
      },
      {
        path: 'menu',
        loadComponent: () => import('@pages/menu/menu').then((m) => m.PageMenu),
      },
      {
        path: 'menu/:idCategory',
        loadComponent: () => import('@pages/menu/menu').then((m) => m.PageMenu),
      },
      {
        path: 'producto/:idProduct',
        loadComponent: () =>
          import('@pages/product/product').then((m) => m.PageProduct),
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('@pages/cart/cart').then((m) => m.PageLandingCart),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('@pages/profile/overview/overview').then(
            (m) => m.PageProfileOverview,
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@pages/profile/info/info').then((m) => m.PageProfileInfo),
          },
          {
            path: 'pedidos',
            loadComponent: () =>
              import('@pages/profile/orders/orders').then(
                (m) => m.PageProfileOrders,
              ),
          },
          {
            path: 'pedidos/:idOrder',
            loadComponent: () =>
              import('@pages/profile/order-details/order-details').then(
                (m) => m.PageProfileOrderDetails,
              ),
          },
          {
            path: 'direcciones',
            loadComponent: () =>
              import('@pages/profile/address/address').then(
                (m) => m.PageProfileAddress,
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('@pages/checkout/checkout').then((m) => m.PageCheckout),
  },
  {
    path: 'pago',
    loadComponent: () =>
      import('@pages/payment/payment').then((m) => m.PagePayment),
  },
  {
    path: 'pedido-confirmado',
    loadComponent: () =>
      import('@pages/order-confirmed/order-confirmed').then(
        (m) => m.PageOrderConfirmed,
      ),
  },
];
