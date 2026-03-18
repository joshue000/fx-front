import { TradeOrder } from '../../core/models/trade-order.model';
import { PaginationMetadata } from '../../core/models/paginated-response.model';

export interface TradesState {
  trades: TradeOrder[];
  pagination: PaginationMetadata | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
}

export const initialTradesState: TradesState = {
  trades: [],
  pagination: null,
  loading: false,
  error: null,
  creating: false,
  createError: null,
};
