import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReplaySubject, of, throwError } from 'rxjs';

import { TradesEffects } from './trades.effects';
import { TradesService } from '../services/trades.service';
import {
  createTrade,
  createTradeFailure,
  createTradeSuccess,
  deleteTradeSuccess,
  loadTrades,
  loadTradesFailure,
  loadTradesSuccess,
} from './trades.actions';
import { selectTradesPagination } from './trades.selectors';
import { DEFAULT_PAGE_SIZE } from '../constants/trades.constants';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
import { PaginatedResponse, PaginationMetadata } from '../../core/models/paginated-response.model';

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

const mockResponse: PaginatedResponse<TradeOrder> = {
  data: [mockTrade],
  metadata: mockPagination,
};

describe('TradesEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: TradesEffects;
  let tradesServiceSpy: jasmine.SpyObj<TradesService>;
  let store: MockStore;

  beforeEach(() => {
    actions$ = new ReplaySubject<Action>(1);
    tradesServiceSpy = jasmine.createSpyObj<TradesService>('TradesService', ['getTrades', 'createTrade']);

    TestBed.configureTestingModule({
      providers: [
        TradesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: TradesService, useValue: tradesServiceSpy },
      ],
    });

    effects = TestBed.inject(TradesEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  describe('loadTrades$', () => {
    it('should dispatch loadTradesSuccess with trades and pagination when the service returns data', (done) => {
      tradesServiceSpy.getTrades.and.returnValue(of(mockResponse));

      effects.loadTrades$.subscribe((action) => {
        expect(action).toEqual(loadTradesSuccess({ trades: [mockTrade], pagination: mockPagination }));
        done();
      });

      actions$.next(loadTrades({ page: 1, limit: 10 }));
    });

    it('should dispatch loadTradesFailure with a network AppError when status is 0', (done) => {
      tradesServiceSpy.getTrades.and.returnValue(
        throwError(() => ({ status: 0, error: null }))
      );

      effects.loadTrades$.subscribe((action) => {
        expect(action).toEqual(loadTradesFailure({
          error: { kind: 'network', message: 'Unable to reach the server. Please check your connection.' },
        }));
        done();
      });

      actions$.next(loadTrades({ page: 1, limit: 10 }));
    });

    it('should dispatch loadTradesFailure with an api AppError when the server responds with an error', (done) => {
      tradesServiceSpy.getTrades.and.returnValue(
        throwError(() => ({ status: 500, error: { message: 'Internal server error' } }))
      );

      effects.loadTrades$.subscribe((action) => {
        expect(action).toEqual(loadTradesFailure({
          error: { kind: 'api', message: 'Internal server error' },
        }));
        done();
      });

      actions$.next(loadTrades({ page: 1, limit: 10 }));
    });

    it('should call TradesService.getTrades with the correct page and limit', (done) => {
      tradesServiceSpy.getTrades.and.returnValue(of(mockResponse));

      effects.loadTrades$.subscribe(() => {
        expect(tradesServiceSpy.getTrades).toHaveBeenCalledWith(2, 10);
        done();
      });

      actions$.next(loadTrades({ page: 2, limit: 10 }));
    });
  });

  describe('createTrade$', () => {
    const mockDto: CreateTradeDto = {
      pair: 'EURUSD',
      side: OrderSide.buy,
      type: OrderType.limit,
      amount: 10000,
      price: 1.0,
    };

    it('should dispatch createTradeSuccess when the service returns the created trade', (done) => {
      tradesServiceSpy.createTrade.and.returnValue(of(mockTrade));

      effects.createTrade$.subscribe((action) => {
        expect(action).toEqual(createTradeSuccess({ trade: mockTrade }));
        done();
      });

      actions$.next(createTrade({ dto: mockDto }));
    });

    it('should dispatch createTradeFailure with an api AppError when the server rejects the request', (done) => {
      tradesServiceSpy.createTrade.and.returnValue(
        throwError(() => ({ status: 400, error: { message: 'Validation failed' } }))
      );

      effects.createTrade$.subscribe((action) => {
        expect(action).toEqual(createTradeFailure({
          error: { kind: 'api', message: 'Validation failed' },
        }));
        done();
      });

      actions$.next(createTrade({ dto: mockDto }));
    });

    it('should call TradesService.createTrade with the provided DTO', (done) => {
      tradesServiceSpy.createTrade.and.returnValue(of(mockTrade));

      effects.createTrade$.subscribe(() => {
        expect(tradesServiceSpy.createTrade).toHaveBeenCalledWith(mockDto);
        done();
      });

      actions$.next(createTrade({ dto: mockDto }));
    });
  });

  describe('reloadAfterDelete$', () => {
    it('should dispatch loadTrades with limit from stored pagination after deleteTradeSuccess', (done) => {
      store.overrideSelector(selectTradesPagination, mockPagination);
      store.refreshState();

      effects.reloadAfterDelete$.subscribe((action) => {
        expect(action).toEqual(loadTrades({ page: 1, limit: mockPagination.limit }));
        done();
      });

      actions$.next(deleteTradeSuccess({ id: '1' }));
    });

    it('should fallback to DEFAULT_PAGE_SIZE when pagination is null', (done) => {
      store.overrideSelector(selectTradesPagination, null);
      store.refreshState();

      effects.reloadAfterDelete$.subscribe((action) => {
        expect(action).toEqual(loadTrades({ page: 1, limit: DEFAULT_PAGE_SIZE }));
        done();
      });

      actions$.next(deleteTradeSuccess({ id: '1' }));
    });
  });
});
