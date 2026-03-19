import { tradesReducer } from './trades.reducer';
import { initialTradesState, TradesState } from './trades.state';
import {
  clearTradesErrors,
  createTrade,
  createTradeFailure,
  createTradeSuccess,
  loadTrades,
  loadTradesFailure,
  loadTradesSuccess,
} from './trades.actions';
import { AppError } from '../../core/models/app-error.model';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
import { PaginationMetadata } from '../../core/models/paginated-response.model';

const mockTrade: TradeOrder = {
  id: '1',
  pair: 'EURUSD',
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

const networkError: AppError = { kind: 'network', message: 'Unable to reach the server.' };
const apiError: AppError = { kind: 'api', message: 'Bad Request' };

describe('tradesReducer', () => {
  it('should return the initial state when an unknown action is dispatched', () => {
    const action = { type: '[Unknown] Action' };
    const state = tradesReducer(undefined, action);
    expect(state).toEqual(initialTradesState);
  });

  describe('loadTrades', () => {
    it('should set loading to true and clear any previous error', () => {
      const previousState: TradesState = {
        ...initialTradesState,
        error: networkError,
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
      const anotherTrade: TradeOrder = { ...mockTrade, id: '2', pair: 'BTCUSD' };
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
    it('should set the AppError and set loading to false', () => {
      const loadingState: TradesState = { ...initialTradesState, loading: true };

      const state = tradesReducer(
        loadingState,
        loadTradesFailure({ error: networkError })
      );

      expect(state.error).toEqual(networkError);
      expect(state.loading).toBeFalse();
    });

    it('should preserve existing trades when a failure occurs', () => {
      const loadingState: TradesState = {
        ...initialTradesState,
        trades: [mockTrade],
        loading: true,
      };

      const state = tradesReducer(loadingState, loadTradesFailure({ error: apiError }));

      expect(state.trades).toEqual([mockTrade]);
    });
  });

  describe('createTrade', () => {
    const mockDto: CreateTradeDto = {
      pair: 'EURUSD',
      side: OrderSide.buy,
      type: OrderType.limit,
      amount: 10000,
      price: 1.0,
    };

    it('should set creating to true and clear any previous createError', () => {
      const previousState: TradesState = {
        ...initialTradesState,
        createError: apiError,
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
      const newTrade: TradeOrder = { ...mockTrade, id: '2', pair: 'BTCUSD' };

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

      const state = tradesReducer(creatingState, createTradeFailure({ error: apiError }));

      expect(state.createError).toEqual(apiError);
      expect(state.creating).toBeFalse();
    });

    it('should preserve existing trades on create failure', () => {
      const creatingState: TradesState = {
        ...initialTradesState,
        trades: [mockTrade],
        creating: true,
      };

      const state = tradesReducer(creatingState, createTradeFailure({ error: networkError }));

      expect(state.trades).toEqual([mockTrade]);
    });
  });

  describe('clearTradesErrors', () => {
    it('should clear all error fields', () => {
      const errorState: TradesState = {
        ...initialTradesState,
        error: networkError,
        createError: apiError,
        loadOneError: apiError,
        updateError: networkError,
        deleteError: apiError,
      };

      const state = tradesReducer(errorState, clearTradesErrors());

      expect(state.error).toBeNull();
      expect(state.createError).toBeNull();
      expect(state.loadOneError).toBeNull();
      expect(state.updateError).toBeNull();
      expect(state.deleteError).toBeNull();
    });
  });
});
