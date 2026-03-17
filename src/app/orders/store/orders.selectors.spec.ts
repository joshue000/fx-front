import { selectOrders, selectOrdersError, selectOrdersLoading, ORDERS_FEATURE_KEY } from './orders.selectors';
import { OrdersState } from './orders.state';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';

const mockOrder: TradeOrder = {
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

const buildState = (slice: Partial<OrdersState>): { [ORDERS_FEATURE_KEY]: OrdersState } => ({
  [ORDERS_FEATURE_KEY]: {
    orders: [],
    loading: false,
    error: null,
    ...slice,
  },
});

describe('Orders Selectors', () => {
  describe('selectOrders', () => {
    it('should return the orders array from state', () => {
      const state = buildState({ orders: [mockOrder] });
      expect(selectOrders(state)).toEqual([mockOrder]);
    });

    it('should return an empty array when no orders exist', () => {
      const state = buildState({ orders: [] });
      expect(selectOrders(state)).toEqual([]);
    });
  });

  describe('selectOrdersLoading', () => {
    it('should return true when loading', () => {
      const state = buildState({ loading: true });
      expect(selectOrdersLoading(state)).toBeTrue();
    });

    it('should return false when not loading', () => {
      const state = buildState({ loading: false });
      expect(selectOrdersLoading(state)).toBeFalse();
    });
  });

  describe('selectOrdersError', () => {
    it('should return the error message when an error exists', () => {
      const state = buildState({ error: 'Something went wrong' });
      expect(selectOrdersError(state)).toBe('Something went wrong');
    });

    it('should return null when there is no error', () => {
      const state = buildState({ error: null });
      expect(selectOrdersError(state)).toBeNull();
    });
  });
});
