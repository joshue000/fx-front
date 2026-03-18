import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'trades',
    pathMatch: 'full'
  },
  {
    path: 'trades',
    loadComponent: () => import('./trades/trades-list/trades-list').then(m => m.TradesList)
  },
  {
    path: 'trades/new',
    loadComponent: () => import('./trades/trade-form/trade-form').then(m => m.TradeForm),
    data: { mode: 'create' }
  },
  {
    path: 'trades/:id/edit',
    loadComponent: () => import('./trades/trade-form/trade-form').then(m => m.TradeForm),
    data: { mode: 'edit' }
  },
  {
    path: 'trades/:id',
    loadComponent: () => import('./trades/trade-form/trade-form').then(m => m.TradeForm),
    data: { mode: 'view' }
  }
];
