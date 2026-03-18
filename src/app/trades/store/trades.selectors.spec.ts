import { selectTrades, selectTradesError, selectTradesLoading, selectTradesPagination, TRADES_FEATURE_KEY } from './trades.selectors';
import { TradesState } from './trades.state';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { PaginationMetadata } from '../../core/models/paginated-response.model';

const mockTrade: TradeOrder = {
  id: '1',
  pair: 'EUR/USD',
  side: OrderSide.buy,
  type: OrderType.limit,
  amount: '10000',
  price: '1.0850',
  status: OrderStatus.open,
  createdAt: new Date('2026-03-10'),
  updatedAt: new Date('2026-03-10'),
};

const mockPagination: PaginationMetadata = {
  page: 2,
  limit: 10,
  total: 24,
  totalPages: 3,
};

const buildState = (slice: Partial<TradesState>): { [TRADES_FEATURE_KEY]: TradesState } => ({
  [TRADES_FEATURE_KEY]: {
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
    ...slice,
  },
});

describe('Trades Selectors', () => {
  describe('selectTrades', () => {
    it('should return the trades array from state', () => {
      const state = buildState({ trades: [mockTrade] });
      expect(selectTrades(state)).toEqual([mockTrade]);
    });

    it('should return an empty array when no trades exist', () => {
      const state = buildState({ trades: [] });
      expect(selectTrades(state)).toEqual([]);
    });
  });

  describe('selectTradesLoading', () => {
    it('should return true when loading', () => {
      const state = buildState({ loading: true });
      expect(selectTradesLoading(state)).toBeTrue();
    });

    it('should return false when not loading', () => {
      const state = buildState({ loading: false });
      expect(selectTradesLoading(state)).toBeFalse();
    });
  });

  describe('selectTradesError', () => {
    it('should return the AppError when an API error exists', () => {
      const error = { kind: 'api' as const, message: 'Something went wrong' };
      const state = buildState({ error });
      expect(selectTradesError(state)).toEqual(error);
    });

    it('should return the AppError when a network error exists', () => {
      const error = { kind: 'network' as const, message: 'Unable to reach the server.' };
      const state = buildState({ error });
      expect(selectTradesError(state)).toEqual(error);
    });

    it('should return null when there is no error', () => {
      const state = buildState({ error: null });
      expect(selectTradesError(state)).toBeNull();
    });
  });

  describe('selectTradesPagination', () => {
    it('should return the pagination metadata when available', () => {
      const state = buildState({ pagination: mockPagination });
      expect(selectTradesPagination(state)).toEqual(mockPagination);
    });

    it('should return null when pagination is not yet loaded', () => {
      const state = buildState({ pagination: null });
      expect(selectTradesPagination(state)).toBeNull();
    });
  });
});
