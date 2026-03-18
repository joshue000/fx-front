import { createAction, props } from '@ngrx/store';

import { TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
import { UpdateTradeDto } from '../../core/dtos/update-trade.dto';
import { PaginationMetadata } from '../../core/models/paginated-response.model';

export const loadTrades = createAction(
  '[Trades] Load Trades',
  props<{ page: number; limit: number }>()
);

export const loadTradesSuccess = createAction(
  '[Trades] Load Trades Success',
  props<{ trades: TradeOrder[]; pagination: PaginationMetadata }>()
);

export const loadTradesFailure = createAction(
  '[Trades] Load Trades Failure',
  props<{ error: string }>()
);

export const loadTrade = createAction(
  '[Trades] Load Trade',
  props<{ id: string }>()
);

export const loadTradeSuccess = createAction(
  '[Trades] Load Trade Success',
  props<{ trade: TradeOrder }>()
);

export const loadTradeFailure = createAction(
  '[Trades] Load Trade Failure',
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

export const updateTrade = createAction(
  '[Trades] Update Trade',
  props<{ id: string; dto: UpdateTradeDto }>()
);

export const updateTradeSuccess = createAction(
  '[Trades] Update Trade Success',
  props<{ trade: TradeOrder }>()
);

export const updateTradeFailure = createAction(
  '[Trades] Update Trade Failure',
  props<{ error: string }>()
);

export const deleteTrade = createAction(
  '[Trades] Delete Trade',
  props<{ id: string }>()
);

export const deleteTradeSuccess = createAction(
  '[Trades] Delete Trade Success',
  props<{ id: string }>()
);

export const deleteTradeFailure = createAction(
  '[Trades] Delete Trade Failure',
  props<{ error: string }>()
);
