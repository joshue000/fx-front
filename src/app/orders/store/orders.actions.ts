import { createAction, props } from '@ngrx/store';

import { TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeOrderDto } from '../../core/dtos/create-trade-order.dto';

export const loadOrders = createAction('[Orders] Load Orders');

export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ orders: TradeOrder[] }>()
);

export const loadOrdersFailure = createAction(
  '[Orders] Load Orders Failure',
  props<{ error: string }>()
);

export const createOrder = createAction(
  '[Orders] Create Order',
  props<{ dto: CreateTradeOrderDto }>()
);

export const createOrderSuccess = createAction(
  '[Orders] Create Order Success',
  props<{ order: TradeOrder }>()
);

export const createOrderFailure = createAction(
  '[Orders] Create Order Failure',
  props<{ error: string }>()
);
