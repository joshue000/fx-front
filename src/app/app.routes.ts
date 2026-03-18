import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.Home)
  },
  {
    path: 'trades',
    loadComponent: () => import('./orders/orders-list/orders-list').then(m => m.OrdersList)
  },
  {
    path: 'trades/new',
    loadComponent: () => import('./trades/trade-form/trade-form').then(m => m.TradeForm)
  },
  {
    path: 'trades/:id',
    loadComponent: () => import('./orders/order-detail/order-detail').then(m => m.OrderDetail)
  }
];
