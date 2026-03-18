import { createReducer, on } from '@ngrx/store';

import { initialTradesState, TradesState } from './trades.state';
import {
  clearTradesErrors,
  createTrade,
  createTradeFailure,
  createTradeSuccess,
  deleteTrade,
  deleteTradeFailure,
  deleteTradeSuccess,
  loadTrade,
  loadTradeFailure,
  loadTradeSuccess,
  loadTrades,
  loadTradesFailure,
  loadTradesSuccess,
  updateTrade,
  updateTradeFailure,
  updateTradeSuccess,
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
  on(loadTrade, (state): TradesState => ({
    ...state,
    selectedTrade: null,
    loadingOne: true,
    loadOneError: null,
  })),
  on(loadTradeSuccess, (state, { trade }): TradesState => ({
    ...state,
    selectedTrade: trade,
    loadingOne: false,
  })),
  on(loadTradeFailure, (state, { error }): TradesState => ({
    ...state,
    loadingOne: false,
    loadOneError: error,
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
  })),
  on(updateTrade, (state): TradesState => ({
    ...state,
    updating: true,
    updateError: null,
  })),
  on(updateTradeSuccess, (state, { trade }): TradesState => ({
    ...state,
    selectedTrade: trade,
    trades: state.trades.map(t => t.id === trade.id ? trade : t),
    updating: false,
  })),
  on(updateTradeFailure, (state, { error }): TradesState => ({
    ...state,
    updating: false,
    updateError: error,
  })),
  on(deleteTrade, (state): TradesState => ({
    ...state,
    deleting: true,
    deleteError: null,
  })),
  on(deleteTradeSuccess, (state, { id }): TradesState => ({
    ...state,
    trades: state.trades.filter(t => t.id !== id),
    deleting: false,
  })),
  on(deleteTradeFailure, (state, { error }): TradesState => ({
    ...state,
    deleting: false,
    deleteError: error,
  })),
  on(clearTradesErrors, (state): TradesState => ({
    ...state,
    error: null,
    createError: null,
    loadOneError: null,
    updateError: null,
    deleteError: null,
  }))
);
