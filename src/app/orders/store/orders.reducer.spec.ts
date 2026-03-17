import { ordersReducer } from './orders.reducer';
import { initialOrdersState, OrdersState } from './orders.state';
import { loadOrders, loadOrdersFailure, loadOrdersSuccess } from './orders.actions';
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

describe('ordersReducer', () => {
  it('should return the initial state when an unknown action is dispatched', () => {
    const action = { type: '[Unknown] Action' } as any;
    const state = ordersReducer(undefined, action);
    expect(state).toEqual(initialOrdersState);
  });

  describe('loadOrders', () => {
    it('should set loading to true and clear any previous error', () => {
      const previousState: OrdersState = {
        ...initialOrdersState,
        error: 'previous error',
        loading: false,
      };

      const state = ordersReducer(previousState, loadOrders());

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should not change the existing orders while loading', () => {
      const previousState: OrdersState = {
        orders: [mockOrder],
        loading: false,
        error: null,
      };

      const state = ordersReducer(previousState, loadOrders());

      expect(state.orders).toEqual([mockOrder]);
    });
  });

  describe('loadOrdersSuccess', () => {
    it('should set orders and set loading to false', () => {
      const loadingState: OrdersState = {
        orders: [],
        loading: true,
        error: null,
      };

      const state = ordersReducer(loadingState, loadOrdersSuccess({ orders: [mockOrder] }));

      expect(state.orders).toEqual([mockOrder]);
      expect(state.loading).toBeFalse();
    });

    it('should replace existing orders with the new payload', () => {
      const anotherOrder: TradeOrder = { ...mockOrder, id: '2', pair: 'GBP/USD' };
      const previousState: OrdersState = {
        orders: [mockOrder],
        loading: true,
        error: null,
      };

      const state = ordersReducer(
        previousState,
        loadOrdersSuccess({ orders: [anotherOrder] })
      );

      expect(state.orders).toEqual([anotherOrder]);
    });
  });

  describe('loadOrdersFailure', () => {
    it('should set the error message and set loading to false', () => {
      const loadingState: OrdersState = {
        orders: [],
        loading: true,
        error: null,
      };

      const state = ordersReducer(
        loadingState,
        loadOrdersFailure({ error: 'Network error' })
      );

      expect(state.error).toBe('Network error');
      expect(state.loading).toBeFalse();
    });

    it('should preserve existing orders when a failure occurs', () => {
      const loadingState: OrdersState = {
        orders: [mockOrder],
        loading: true,
        error: null,
      };

      const state = ordersReducer(loadingState, loadOrdersFailure({ error: 'Timeout' }));

      expect(state.orders).toEqual([mockOrder]);
    });
  });
});
