import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { OrdersList } from './orders-list';
import { loadOrders } from '../store/orders.actions';
import { selectOrders, selectOrdersError, selectOrdersLoading } from '../store/orders.selectors';
import { OrdersState } from '../store/orders.state';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { ORDERS_FEATURE_KEY } from '../store/orders.selectors';

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

const initialState: { [ORDERS_FEATURE_KEY]: OrdersState } = {
  [ORDERS_FEATURE_KEY]: {
    orders: [],
    loading: false,
    error: null,
  },
};

describe('OrdersList', () => {
  let component: OrdersList;
  let fixture: ComponentFixture<OrdersList>;
  let store: MockStore;
  let mockSelectOrders: MemoizedSelector<object, TradeOrder[]>;
  let mockSelectLoading: MemoizedSelector<object, boolean>;
  let mockSelectError: MemoizedSelector<object, string | null>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersList],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockSelectOrders = store.overrideSelector(selectOrders, []);
    mockSelectLoading = store.overrideSelector(selectOrdersLoading, false);
    mockSelectError = store.overrideSelector(selectOrdersError, null);

    fixture = TestBed.createComponent(OrdersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadOrders on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(loadOrders());
  });

  it('should display the orders table when orders are available', async () => {
    mockSelectOrders.setResult([mockOrder]);
    mockSelectLoading.setResult(false);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll('.orders-table__row');
    expect(rows.length).toBe(1);
    expect(rows[0].querySelector('.orders-table__pair').textContent.trim()).toBe('EUR/USD');
  });

  it('should display the loading indicator when loading is true', async () => {
    mockSelectLoading.setResult(true);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const loading = fixture.nativeElement.querySelector('.orders-loading');
    expect(loading).not.toBeNull();
    expect(loading.textContent.trim()).toBe('Loading orders...');
  });

  it('should display the error message when an error exists', async () => {
    mockSelectError.setResult('Failed to load orders');
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const error = fixture.nativeElement.querySelector('.orders-error');
    expect(error).not.toBeNull();
    expect(error.textContent.trim()).toBe('Failed to load orders');
  });

  it('should display the empty state when orders list is empty', async () => {
    mockSelectOrders.setResult([]);
    mockSelectLoading.setResult(false);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    const emptyCell = fixture.nativeElement.querySelector('.orders-table__empty');
    expect(emptyCell).not.toBeNull();
    expect(emptyCell.textContent.trim()).toBe('No orders found.');
  });

  it('should return the order id from trackById', () => {
    expect(component.trackById(0, mockOrder)).toBe('1');
  });

  it('should navigate to order detail when goToDetail is called', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.goToDetail('42');

    expect(router.navigate).toHaveBeenCalledWith(['/orders', '42']);
  });

  it('should navigate to new order form when goToCreate is called', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.goToCreate();

    expect(router.navigate).toHaveBeenCalledWith(['/orders', 'new']);
  });
});
