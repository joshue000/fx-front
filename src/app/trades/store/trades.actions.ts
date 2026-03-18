import { createAction, props } from '@ngrx/store';

import { TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';

export const loadTrades = createAction('[Trades] Load Trades');

export const loadTradesSuccess = createAction(
  '[Trades] Load Trades Success',
  props<{ trades: TradeOrder[] }>()
);

export const loadTradesFailure = createAction(
  '[Trades] Load Trades Failure',
  props<{ error: string }>()
);

export const createTrade = createAction(
  '[Trades] Create Trade',
  props<{ dto: CreateTradeDto }>()
);

export const createTradeSuccess = createAction(
  '[Trades] Create Trade Success',
  props<{ trade: TradeOrder }>()
);

export const createTradeFailure = createAction(
  '[Trades] Create Trade Failure',
  props<{ error: string }>()
);
