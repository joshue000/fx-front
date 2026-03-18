import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { TradesList, DEFAULT_PAGE_SIZE } from './trades-list';
import { loadTrades } from '../store/trades.actions';
import { selectTrades, selectTradesError, selectTradesLoading, selectTradesPagination } from '../store/trades.selectors';
import { TradesState } from '../store/trades.state';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { TRADES_FEATURE_KEY } from '../store/trades.selectors';
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

const initialState: { [TRADES_FEATURE_KEY]: TradesState } = {
  [TRADES_FEATURE_KEY]: {
    trades: [],
    pagination: null,
    loading: false,
    error: null,
    creating: false,
    createError: null,
  },
};

describe('TradesList', () => {
  let component: TradesList;
  let fixture: ComponentFixture<TradesList>;
  let store: MockStore;
  let mockSelectTrades: MemoizedSelector<object, TradeOrder[]>;
  let mockSelectLoading: MemoizedSelector<object, boolean>;
  let mockSelectError: MemoizedSelector<object, string | null>;
  let mockSelectPagination: MemoizedSelector<object, PaginationMetadata | null>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradesList],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockSelectTrades = store.overrideSelector(selectTrades, []);
    mockSelectLoading = store.overrideSelector(selectTradesLoading, false);
    mockSelectError = store.overrideSelector(selectTradesError, null);
    mockSelectPagination = store.overrideSelector(selectTradesPagination, null);

    fixture = TestBed.createComponent(TradesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTrades with page 1 and default limit on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(loadTrades({ page: 1, limit: DEFAULT_PAGE_SIZE }));
  });

  it('should display the trades table when trades are available', async () => {
    mockSelectTrades.setResult([mockTrade]);
    mockSelectLoading.setResult(false);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll('.trades-table__row');
    expect(rows.length).toBe(1);
    expect(rows[0].querySelector('.trades-table__pair').textContent.trim()).toBe('EUR/USD');
  });

  it('should display the loading indicator when loading is true', async () => {
    mockSelectLoading.setResult(true);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const loading = fixture.nativeElement.querySelector('.trades-loading');
    expect(loading).not.toBeNull();
    expect(loading.textContent.trim()).toBe('Loading trades...');
  });

  it('should display the error message when an error exists', async () => {
    mockSelectError.setResult('Failed to load trades');
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const error = fixture.nativeElement.querySelector('.trades-error');
    expect(error).not.toBeNull();
    expect(error.textContent.trim()).toBe('Failed to load trades');
  });

  it('should display the empty state when trades list is empty', async () => {
    mockSelectTrades.setResult([]);
    mockSelectLoading.setResult(false);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const emptyCell = fixture.nativeElement.querySelector('.trades-table__empty');
    expect(emptyCell).not.toBeNull();
    expect(emptyCell.textContent.trim()).toBe('No trades found.');
  });

  it('should return the trade id from trackById', () => {
    expect(component.trackById(0, mockTrade)).toBe('1');
  });

  it('should dispatch loadTrades with the new page when onPageChange is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.onPageChange(3);

    expect(dispatchSpy).toHaveBeenCalledWith(loadTrades({ page: 3, limit: DEFAULT_PAGE_SIZE }));
  });

  it('should show the pagination component when totalPages > 1', async () => {
    mockSelectTrades.setResult([mockTrade]);
    mockSelectPagination.setResult(mockPagination);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const pagination = fixture.nativeElement.querySelector('app-pagination');
    expect(pagination).not.toBeNull();
  });

  it('should not show the pagination component when totalPages is 1', async () => {
    mockSelectTrades.setResult([mockTrade]);
    mockSelectPagination.setResult({ ...mockPagination, totalPages: 1 });
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const pagination = fixture.nativeElement.querySelector('app-pagination');
    expect(pagination).toBeNull();
  });

  it('should navigate to trade detail when goToDetail is called', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.goToDetail('42');

    expect(router.navigate).toHaveBeenCalledWith(['/trades', '42']);
  });

  it('should navigate to new trade form when goToCreate is called', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.goToCreate();

    expect(router.navigate).toHaveBeenCalledWith(['/trades', 'new']);
  });
});
