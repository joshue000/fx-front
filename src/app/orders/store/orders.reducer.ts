import { createReducer, on } from '@ngrx/store';

import { initialOrdersState, OrdersState } from './orders.state';
import { loadOrders, loadOrdersFailure, loadOrdersSuccess } from './orders.actions';

export const ordersReducer = createReducer<OrdersState>(
  initialOrdersState,
  on(loadOrders, (state): OrdersState => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadOrdersSuccess, (state, { orders }): OrdersState => ({
    ...state,
    orders,
    loading: false
  })),
  on(loadOrdersFailure, (state, { error }): OrdersState => ({
    ...state,
    loading: false,
    error
  }))
);
