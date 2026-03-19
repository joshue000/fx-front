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

export const selectTradesPagination = createSelector(
  selectTradesState,
  state => state.pagination
);

export const selectTradesCreating = createSelector(
  selectTradesState,
  state => state.creating
);

export const selectTradesCreateError = createSelector(
  selectTradesState,
  state => state.createError
);

export const selectSelectedTrade = createSelector(
  selectTradesState,
  state => state.selectedTrade
);

export const selectTradesLoadingOne = createSelector(
  selectTradesState,
  state => state.loadingOne
);

export const selectTradesLoadOneError = createSelector(
  selectTradesState,
  state => state.loadOneError
);

export const selectTradesUpdating = createSelector(
  selectTradesState,
  state => state.updating
);

export const selectTradesUpdateError = createSelector(
  selectTradesState,
  state => state.updateError
);

export const selectTradesDeleting = createSelector(
  selectTradesState,
  state => state.deleting
);

export const selectTradesDeleteError = createSelector(
  selectTradesState,
  state => state.deleteError
);

export const selectIsLoading = createSelector(
  selectTradesState,
  state => state.loading || state.loadingOne
);
