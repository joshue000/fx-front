import { TradeOrder } from '../../core/models/trade-order.model';
import { AppError } from '../../core/models/app-error.model';
import { PaginationMetadata } from '../../core/models/paginated-response.model';

export interface TradesState {
  trades: TradeOrder[];
  pagination: PaginationMetadata | null;
  loading: boolean;
  error: AppError | null;
  creating: boolean;
  createError: AppError | null;
  selectedTrade: TradeOrder | null;
  loadingOne: boolean;
  loadOneError: AppError | null;
  updating: boolean;
  updateError: AppError | null;
  deleting: boolean;
  deleteError: AppError | null;
}

export const initialTradesState: TradesState = {
  trades: [],
  pagination: null,
  loading: false,
  error: null,
  creating: false,
  createError: null,
  selectedTrade: null,
  loadingOne: false,
  loadOneError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
};
