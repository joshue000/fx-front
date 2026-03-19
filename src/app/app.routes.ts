import { Routes } from '@angular/router';
import { TradeFormMode } from './core/models/trade-form-mode.model';

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
    data: { mode: 'create' satisfies TradeFormMode }
  },
  {
    path: 'trades/:id/edit',
    loadComponent: () => import('./trades/trade-form/trade-form').then(m => m.TradeForm),
    data: { mode: 'edit' satisfies TradeFormMode }
  },
  {
    path: 'trades/:id',
    loadComponent: () => import('./trades/trade-form/trade-form').then(m => m.TradeForm),
    data: { mode: 'view' satisfies TradeFormMode }
  }
];
