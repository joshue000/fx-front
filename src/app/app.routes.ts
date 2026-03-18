import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.Home)
  },
  {
    path: 'trades',
    loadComponent: () => import('./trades/trades-list/trades-list').then(m => m.TradesList)
  },
  {
    path: 'trades/new',
    loadComponent: () => import('./trades/trade-form/trade-form').then(m => m.TradeForm)
  },
  {
    path: 'trades/:id',
    loadComponent: () => import('./trades/trade-detail/trade-detail').then(m => m.TradeDetail)
  }
];
