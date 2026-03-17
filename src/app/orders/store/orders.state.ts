import { TradeOrder } from '../../core/models/trade-order.model';

export interface OrdersState {
  orders: TradeOrder[];
  loading: boolean;
  error: string | null;
}

export const initialOrdersState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};
