import { ordersReducer } from './orders.reducer';
import { initialOrdersState, OrdersState } from './orders.state';
import {
  createOrder,
  createOrderFailure,
  createOrderSuccess,
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess,
} from './orders.actions';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeOrderDto } from '../../core/dtos/create-trade-order.dto';

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
        ...initialOrdersState,
        orders: [mockOrder],
      };

      const state = ordersReducer(previousState, loadOrders());

      expect(state.orders).toEqual([mockOrder]);
    });
  });

  describe('loadOrdersSuccess', () => {
    it('should set orders and set loading to false', () => {
      const loadingState: OrdersState = { ...initialOrdersState, loading: true };

      const state = ordersReducer(loadingState, loadOrdersSuccess({ orders: [mockOrder] }));

      expect(state.orders).toEqual([mockOrder]);
      expect(state.loading).toBeFalse();
    });

    it('should replace existing orders with the new payload', () => {
      const anotherOrder: TradeOrder = { ...mockOrder, id: '2', pair: 'GBP/USD' };
      const previousState: OrdersState = {
        ...initialOrdersState,
        orders: [mockOrder],
        loading: true,
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
      const loadingState: OrdersState = { ...initialOrdersState, loading: true };

      const state = ordersReducer(
        loadingState,
        loadOrdersFailure({ error: 'Network error' })
      );

      expect(state.error).toBe('Network error');
      expect(state.loading).toBeFalse();
    });

    it('should preserve existing orders when a failure occurs', () => {
      const loadingState: OrdersState = {
        ...initialOrdersState,
        orders: [mockOrder],
        loading: true,
      };

      const state = ordersReducer(loadingState, loadOrdersFailure({ error: 'Timeout' }));

      expect(state.orders).toEqual([mockOrder]);
    });
  });

  describe('createOrder', () => {
    const mockDto: CreateTradeOrderDto = {
      pair: 'EUR/USD',
      side: OrderSide.buy,
      type: OrderType.limit,
      amount: 10000,
      price: 1.085,
    };

    it('should set creating to true and clear any previous createError', () => {
      const previousState: OrdersState = {
        ...initialOrdersState,
        createError: 'previous error',
      };

      const state = ordersReducer(previousState, createOrder({ dto: mockDto }));

      expect(state.creating).toBeTrue();
      expect(state.createError).toBeNull();
    });
  });

  describe('createOrderSuccess', () => {
    it('should append the new order and set creating to false', () => {
      const creatingState: OrdersState = {
        ...initialOrdersState,
        orders: [mockOrder],
        creating: true,
      };
      const newOrder: TradeOrder = { ...mockOrder, id: '2', pair: 'GBP/USD' };

      const state = ordersReducer(creatingState, createOrderSuccess({ order: newOrder }));

      expect(state.orders).toEqual([mockOrder, newOrder]);
      expect(state.creating).toBeFalse();
    });
  });

  describe('createOrderFailure', () => {
    it('should set createError and set creating to false', () => {
      const creatingState: OrdersState = {
        ...initialOrdersState,
        creating: true,
      };

      const state = ordersReducer(creatingState, createOrderFailure({ error: 'Bad Request' }));

      expect(state.createError).toBe('Bad Request');
      expect(state.creating).toBeFalse();
    });

    it('should preserve existing orders on create failure', () => {
      const creatingState: OrdersState = {
        ...initialOrdersState,
        orders: [mockOrder],
        creating: true,
      };

      const state = ordersReducer(creatingState, createOrderFailure({ error: 'Server Error' }));

      expect(state.orders).toEqual([mockOrder]);
    });
  });
});
