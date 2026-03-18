import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Action, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { TradeForm } from './trade-form';
import { createTrade, createTradeSuccess } from '../store/trades.actions';
import { selectTradesCreateError, selectTradesCreating } from '../store/trades.selectors';
import { TradesState } from '../store/trades.state';
import { TRADES_FEATURE_KEY } from '../store/trades.selectors';
import { OrderSide, OrderStatus, OrderType } from '../../core/models/trade-order.model';

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

describe('TradeForm', () => {
  let component: TradeForm;
  let fixture: ComponentFixture<TradeForm>;
  let store: MockStore;
  let actions$: ReplaySubject<Action>;
  let mockSelectCreating: MemoizedSelector<object, boolean>;
  let mockSelectCreateError: MemoizedSelector<object, string | null>;

  beforeEach(async () => {
    actions$ = new ReplaySubject<Action>(1);

    await TestBed.configureTestingModule({
      imports: [TradeForm],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockSelectCreating = store.overrideSelector(selectTradesCreating, false);
    mockSelectCreateError = store.overrideSelector(selectTradesCreateError, null);

    fixture = TestBed.createComponent(TradeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.form.value).toEqual({
      pair: '',
      side: '',
      type: '',
      amount: null,
      price: null,
      status: '',
    });
  });

  it('should expose all order sides', () => {
    expect(component.orderSides).toEqual(Object.values(OrderSide));
  });

  it('should expose all order types', () => {
    expect(component.orderTypes).toEqual(Object.values(OrderType));
  });

  describe('form validation', () => {
    it('should be invalid when required fields are empty', () => {
      expect(component.form.invalid).toBeTrue();
    });

    it('should be valid when all required fields are filled', () => {
      component.form.setValue({
        pair: 'EUR/USD',
        side: OrderSide.buy,
        type: OrderType.limit,
        amount: 10000,
        price: 1.085,
        status: '',
      });

      expect(component.form.valid).toBeTrue();
    });

    it('should mark all controls as touched when submitting an invalid form', () => {
      component.onSubmit();

      expect(component.form.get('pair')?.touched).toBeTrue();
      expect(component.form.get('side')?.touched).toBeTrue();
    });

    it('should report isInvalid true for a required field that is touched and empty', () => {
      component.form.get('pair')?.markAsTouched();

      expect(component.isInvalid('pair')).toBeTrue();
    });

    it('should report isInvalid false for a valid field', () => {
      component.form.patchValue({ pair: 'EUR/USD' });
      component.form.get('pair')?.markAsTouched();

      expect(component.isInvalid('pair')).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    it('should not dispatch when the form is invalid', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.onSubmit();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch createTrade with the correct DTO when the form is valid', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.form.setValue({
        pair: 'EUR/USD',
        side: OrderSide.buy,
        type: OrderType.limit,
        amount: 10000,
        price: 1.085,
        status: '',
      });

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        createTrade({
          dto: {
            pair: 'EUR/USD',
            side: OrderSide.buy,
            type: OrderType.limit,
            amount: 10000,
            price: 1.085,
          },
        })
      );
    });

    it('should include status in the DTO when it is selected', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.form.setValue({
        pair: 'GBP/USD',
        side: OrderSide.sell,
        type: OrderType.market,
        amount: 5000,
        price: 1.264,
        status: OrderStatus.open,
      });

      component.onSubmit();

      const dispatchedAction = dispatchSpy.calls.mostRecent().args[0] as unknown as ReturnType<typeof createTrade>;
      expect(dispatchedAction.dto.status).toBe(OrderStatus.open);
    });
  });

  describe('navigation', () => {
    it('should navigate to /trades when goBack is called', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/trades']);
    });

    it('should navigate to /trades after createTradeSuccess action', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      actions$.next(createTradeSuccess({ trade: {} as any }));

      expect(router.navigate).toHaveBeenCalledWith(['/trades']);
    });
  });

  describe('template', () => {
    it('should display the error message when createError$ emits', async () => {
      mockSelectCreateError.setResult('Server error');
      store.refreshState();
      fixture.detectChanges();
      await fixture.whenStable();

      const errorEl = fixture.nativeElement.querySelector('.trade-form__error');
      expect(errorEl).not.toBeNull();
      expect(errorEl.textContent.trim()).toBe('Server error');
    });

    it('should disable the submit button when creating$ is true', async () => {
      mockSelectCreating.setResult(true);
      store.refreshState();
      fixture.detectChanges();
      await fixture.whenStable();

      const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn.disabled).toBeTrue();
    });
  });
});
