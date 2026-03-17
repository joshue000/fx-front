import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.Home)
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders-list/orders-list').then(m => m.OrdersList)
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./orders/order-detail/order-detail').then(m => m.OrderDetail)
  }
];
