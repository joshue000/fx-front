import { createReducer, on } from '@ngrx/store';

import { initialTradesState, TradesState } from './trades.state';
import {
  createTrade,
  createTradeFailure,
  createTradeSuccess,
  loadTrades,
  loadTradesFailure,
  loadTradesSuccess,
} from './trades.actions';

export const tradesReducer = createReducer<TradesState>(
  initialTradesState,
  on(loadTrades, (state): TradesState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadTradesSuccess, (state, { trades, pagination }): TradesState => ({
    ...state,
    trades,
    pagination,
    loading: false,
  })),
  on(loadTradesFailure, (state, { error }): TradesState => ({
    ...state,
    loading: false,
    error,
  })),
  on(createTrade, (state): TradesState => ({
    ...state,
    creating: true,
    createError: null,
  })),
  on(createTradeSuccess, (state, { trade }): TradesState => ({
    ...state,
    trades: [...state.trades, trade],
    creating: false,
  })),
  on(createTradeFailure, (state, { error }): TradesState => ({
    ...state,
    creating: false,
    createError: error,
  }))
);
