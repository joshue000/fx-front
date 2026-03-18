import { TradeOrder } from '../../core/models/trade-order.model';

export interface TradesState {
  trades: TradeOrder[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
}

export const initialTradesState: TradesState = {
  trades: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
};
