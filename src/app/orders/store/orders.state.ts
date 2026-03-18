import { TradeOrder } from '../../core/models/trade-order.model';

export interface OrdersState {
  orders: TradeOrder[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
}

export const initialOrdersState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
};
