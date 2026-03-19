import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { Action, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { TradesList, DEFAULT_PAGE_SIZE } from './trades-list';
import { clearTradesErrors, deleteTrade, deleteTradeSuccess, loadTrades } from '../store/trades.actions';
import { selectTrades, selectTradesDeleteError, selectTradesError, selectTradesLoading, selectTradesPagination } from '../store/trades.selectors';
import { TradesState } from '../store/trades.state';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { AppError } from '../../core/models/app-error.model';
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
    selectedTrade: null,
    loadingOne: false,
    loadOneError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
  },
};

describe('TradesList', () => {
  let component: TradesList;
  let fixture: ComponentFixture<TradesList>;
  let store: MockStore;
  let actions$: ReplaySubject<Action>;
  let mockSelectTrades: MemoizedSelector<object, TradeOrder[]>;
  let mockSelectLoading: MemoizedSelector<object, boolean>;
  let mockSelectError: MemoizedSelector<object, AppError | null>;
  let mockSelectPagination: MemoizedSelector<object, PaginationMetadata | null>;

  beforeEach(async () => {
    actions$ = new ReplaySubject<Action>(1);

    await TestBed.configureTestingModule({
      imports: [TradesList],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockSelectTrades = store.overrideSelector(selectTrades, []);
    mockSelectLoading = store.overrideSelector(selectTradesLoading, false);
    mockSelectError = store.overrideSelector(selectTradesError, null);
    store.overrideSelector(selectTradesDeleteError, null);
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

  it('should not render the table while loading', async () => {
    mockSelectTrades.setResult([mockTrade]);
    mockSelectLoading.setResult(true);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.trades-table')).toBeNull();
  });

  it('should show an ErrorModal when an API error exists', async () => {
    mockSelectError.setResult({ kind: 'api', message: 'Failed to load trades' });
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const modal = fixture.nativeElement.querySelector('app-error-modal');
    expect(modal).not.toBeNull();
  });

  it('should show ConnectionError when a network error exists', async () => {
    mockSelectError.setResult({ kind: 'network', message: 'Unable to reach the server.' });
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const connError = fixture.nativeElement.querySelector('app-connection-error');
    expect(connError).not.toBeNull();
  });

  it('should dispatch clearTradesErrors when delete error is dismissed', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.onDeleteErrorDismissed();
    expect(dispatchSpy).toHaveBeenCalledWith(clearTradesErrors());
  });

  it('should display the empty state when trades list is empty', async () => {
    mockSelectTrades.setResult([]);
    mockSelectLoading.setResult(false);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const emptyCell = fixture.nativeElement.querySelector('.trades-table__empty');
    expect(emptyCell).not.toBeNull();
    expect(emptyCell.textContent.trim()).toBe('trades.table.empty');
  });

  it('should return the trade id from trackById', () => {
    expect(component.trackById(0, mockTrade)).toBe('1');
  });

  it('should dispatch loadTrades with the new page when onPageChange is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.onPageChange(3);

    expect(dispatchSpy).toHaveBeenCalledWith(loadTrades({ page: 3, limit: DEFAULT_PAGE_SIZE }));
  });

  it('should dispatch loadTrades from page 1 with new limit when onPageSizeChange is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.onPageSizeChange(20);

    expect(dispatchSpy).toHaveBeenCalledWith(loadTrades({ page: 1, limit: 20 }));
    expect(component.currentPageSize).toBe(20);
  });

  it('should always use currentPageSize when changing page', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.onPageSizeChange(5);
    dispatchSpy.calls.reset();
    component.onPageChange(2);

    expect(dispatchSpy).toHaveBeenCalledWith(loadTrades({ page: 2, limit: 5 }));
  });

  it('should show the pagination component when totalPages > 1', async () => {
    mockSelectTrades.setResult([mockTrade]);
    mockSelectLoading.setResult(false);
    mockSelectPagination.setResult(mockPagination);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const pagination = fixture.nativeElement.querySelector('app-pagination');
    expect(pagination).not.toBeNull();
  });

  it('should not show the pagination component when totalPages is 1', async () => {
    mockSelectTrades.setResult([mockTrade]);
    mockSelectLoading.setResult(false);
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

  it('should navigate to trade edit when goToEdit is called', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.goToEdit('42');

    expect(router.navigate).toHaveBeenCalledWith(['/trades', '42', 'edit']);
  });

  it('should navigate to new trade form when goToCreate is called', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.goToCreate();

    expect(router.navigate).toHaveBeenCalledWith(['/trades', 'new']);
  });

  describe('delete flow', () => {
    it('should open the delete modal and set deleteTargetId when onDelete is called', () => {
      component.onDelete('99');

      expect(component.showDeleteModal).toBeTrue();
      expect(component.deleteTargetId).toBe('99');
    });

    it('should close the delete modal and clear deleteTargetId when onDeleteCancelled is called', () => {
      component.onDelete('99');
      component.onDeleteCancelled();

      expect(component.showDeleteModal).toBeFalse();
      expect(component.deleteTargetId).toBeNull();
    });

    it('should dispatch deleteTrade when onDeleteConfirmed is called with a target id', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.deleteTargetId = '99';

      component.onDeleteConfirmed();

      expect(dispatchSpy).toHaveBeenCalledWith(deleteTrade({ id: '99' }));
    });

    it('should close the modal and reload trades when deleteTradeSuccess is dispatched', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.showDeleteModal = true;
      component.deleteTargetId = '99';

      actions$.next(deleteTradeSuccess({ id: '99' }));

      expect(component.showDeleteModal).toBeFalse();
      expect(component.deleteTargetId).toBeNull();
      expect(dispatchSpy).toHaveBeenCalledWith(loadTrades({ page: 1, limit: DEFAULT_PAGE_SIZE }));
    });
  });
});
