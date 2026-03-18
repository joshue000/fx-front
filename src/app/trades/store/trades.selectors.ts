import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TradesState } from './trades.state';

export const TRADES_FEATURE_KEY = 'trades';

export const selectTradesState = createFeatureSelector<TradesState>(TRADES_FEATURE_KEY);

export const selectTrades = createSelector(
  selectTradesState,
  state => state.trades
);

export const selectTradesLoading = createSelector(
  selectTradesState,
  state => state.loading
);

export const selectTradesError = createSelector(
  selectTradesState,
  state => state.error
);

export const selectTradesCreating = createSelector(
  selectTradesState,
  state => state.creating
);

export const selectTradesCreateError = createSelector(
  selectTradesState,
  state => state.createError
);
