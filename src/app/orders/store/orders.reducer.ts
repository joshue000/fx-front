import { createReducer, on } from '@ngrx/store';

import { initialOrdersState, OrdersState } from './orders.state';
import {
  createOrder,
  createOrderFailure,
  createOrderSuccess,
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess,
} from './orders.actions';

export const ordersReducer = createReducer<OrdersState>(
  initialOrdersState,
  on(loadOrders, (state): OrdersState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadOrdersSuccess, (state, { orders }): OrdersState => ({
    ...state,
    orders,
    loading: false,
  })),
  on(loadOrdersFailure, (state, { error }): OrdersState => ({
    ...state,
    loading: false,
    error,
  })),
  on(createOrder, (state): OrdersState => ({
    ...state,
    creating: true,
    createError: null,
  })),
  on(createOrderSuccess, (state, { order }): OrdersState => ({
    ...state,
    orders: [...state.orders, order],
    creating: false,
  })),
  on(createOrderFailure, (state, { error }): OrdersState => ({
    ...state,
    creating: false,
    createError: error,
  }))
);
