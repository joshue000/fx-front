import { tradesReducer } from './trades.reducer';
import { initialTradesState, TradesState } from './trades.state';
import {
  createTrade,
  createTradeFailure,
  createTradeSuccess,
  loadTrades,
  loadTradesFailure,
  loadTradesSuccess,
} from './trades.actions';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
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
  page: 1,
  limit: 10,
  total: 24,
  totalPages: 3,
};

describe('tradesReducer', () => {
  it('should return the initial state when an unknown action is dispatched', () => {
    const action = { type: '[Unknown] Action' } as any;
    const state = tradesReducer(undefined, action);
    expect(state).toEqual(initialTradesState);
  });

  describe('loadTrades', () => {
    it('should set loading to true and clear any previous error', () => {
      const previousState: TradesState = {
        ...initialTradesState,
        error: 'previous error',
        loading: false,
      };

      const state = tradesReducer(previousState, loadTrades({ page: 1, limit: 10 }));

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should not change the existing trades while loading', () => {
      const previousState: TradesState = {
        ...initialTradesState,
        trades: [mockTrade],
      };

      const state = tradesReducer(previousState, loadTrades({ page: 1, limit: 10 }));

      expect(state.trades).toEqual([mockTrade]);
    });
  });

  describe('loadTradesSuccess', () => {
    it('should set trades, pagination and set loading to false', () => {
      const loadingState: TradesState = { ...initialTradesState, loading: true };

      const state = tradesReducer(
        loadingState,
        loadTradesSuccess({ trades: [mockTrade], pagination: mockPagination })
      );

      expect(state.trades).toEqual([mockTrade]);
      expect(state.pagination).toEqual(mockPagination);
      expect(state.loading).toBeFalse();
    });

    it('should replace existing trades with the new payload', () => {
      const anotherTrade: TradeOrder = { ...mockTrade, id: '2', pair: 'GBP/USD' };
      const previousState: TradesState = {
        ...initialTradesState,
        trades: [mockTrade],
        loading: true,
      };

      const state = tradesReducer(
        previousState,
        loadTradesSuccess({ trades: [anotherTrade], pagination: mockPagination })
      );

      expect(state.trades).toEqual([anotherTrade]);
    });
  });

  describe('loadTradesFailure', () => {
    it('should set the error message and set loading to false', () => {
      const loadingState: TradesState = { ...initialTradesState, loading: true };

      const state = tradesReducer(
        loadingState,
        loadTradesFailure({ error: 'Network error' })
      );

      expect(state.error).toBe('Network error');
      expect(state.loading).toBeFalse();
    });

    it('should preserve existing trades when a failure occurs', () => {
      const loadingState: TradesState = {
        ...initialTradesState,
        trades: [mockTrade],
        loading: true,
      };

      const state = tradesReducer(loadingState, loadTradesFailure({ error: 'Timeout' }));

      expect(state.trades).toEqual([mockTrade]);
    });
  });

  describe('createTrade', () => {
    const mockDto: CreateTradeDto = {
      pair: 'EUR/USD',
      side: OrderSide.buy,
      type: OrderType.limit,
      amount: 10000,
      price: 1.085,
    };

    it('should set creating to true and clear any previous createError', () => {
      const previousState: TradesState = {
        ...initialTradesState,
        createError: 'previous error',
      };

      const state = tradesReducer(previousState, createTrade({ dto: mockDto }));

      expect(state.creating).toBeTrue();
      expect(state.createError).toBeNull();
    });
  });

  describe('createTradeSuccess', () => {
    it('should append the new trade and set creating to false', () => {
      const creatingState: TradesState = {
        ...initialTradesState,
        trades: [mockTrade],
        creating: true,
      };
      const newTrade: TradeOrder = { ...mockTrade, id: '2', pair: 'GBP/USD' };

      const state = tradesReducer(creatingState, createTradeSuccess({ trade: newTrade }));

      expect(state.trades).toEqual([mockTrade, newTrade]);
      expect(state.creating).toBeFalse();
    });
  });

  describe('createTradeFailure', () => {
    it('should set createError and set creating to false', () => {
      const creatingState: TradesState = {
        ...initialTradesState,
        creating: true,
      };

      const state = tradesReducer(creatingState, createTradeFailure({ error: 'Bad Request' }));

      expect(state.createError).toBe('Bad Request');
      expect(state.creating).toBeFalse();
    });

    it('should preserve existing trades on create failure', () => {
      const creatingState: TradesState = {
        ...initialTradesState,
        trades: [mockTrade],
        creating: true,
      };

      const state = tradesReducer(creatingState, createTradeFailure({ error: 'Server Error' }));

      expect(state.trades).toEqual([mockTrade]);
    });
  });
});
