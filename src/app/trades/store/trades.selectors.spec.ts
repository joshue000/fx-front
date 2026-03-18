import { selectTrades, selectTradesError, selectTradesLoading, TRADES_FEATURE_KEY } from './trades.selectors';
import { TradesState } from './trades.state';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';

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

const buildState = (slice: Partial<TradesState>): { [TRADES_FEATURE_KEY]: TradesState } => ({
  [TRADES_FEATURE_KEY]: {
    trades: [],
    loading: false,
    error: null,
    creating: false,
    createError: null,
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
    it('should return the error message when an error exists', () => {
      const state = buildState({ error: 'Something went wrong' });
      expect(selectTradesError(state)).toBe('Something went wrong');
    });

    it('should return null when there is no error', () => {
      const state = buildState({ error: null });
      expect(selectTradesError(state)).toBeNull();
    });
  });
});
