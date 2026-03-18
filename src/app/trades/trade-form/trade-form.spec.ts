import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Action, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { TradeForm } from './trade-form';
import { createTrade, createTradeSuccess, updateTradeSuccess } from '../store/trades.actions';
import {
  selectTradesCreateError,
  selectTradesCreating,
  selectTradesUpdateError,
  selectTradesUpdating,
} from '../store/trades.selectors';
import { TradesState } from '../store/trades.state';
import { TRADES_FEATURE_KEY } from '../store/trades.selectors';
import { OrderSide, OrderStatus, OrderType } from '../../core/models/trade-order.model';
import { AppError } from '../../core/models/app-error.model';
import { MARKET_PRICES } from '../../core/constants/market-prices.constant';

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

describe('TradeForm', () => {
  let component: TradeForm;
  let fixture: ComponentFixture<TradeForm>;
  let store: MockStore;
  let actions$: ReplaySubject<Action>;
  let mockSelectCreating: MemoizedSelector<object, boolean>;
  let mockSelectCreateError: MemoizedSelector<object, AppError | null>;

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
    store.overrideSelector(selectTradesUpdating, false);
    store.overrideSelector(selectTradesUpdateError, null);

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

  it('should default to create mode when no route data is present', () => {
    expect(component.mode).toBe('create');
  });

  it('should initialize the form with empty values except status which defaults to open', () => {
    expect(component.form.value).toEqual({
      pair: '',
      side: '',
      type: '',
      amount: null,
      price: null,
      status: OrderStatus.open,
    });
  });

  it('should expose all order sides', () => {
    expect(component.orderSides).toEqual(Object.values(OrderSide));
  });

  it('should expose all order types', () => {
    expect(component.orderTypes).toEqual(Object.values(OrderType));
  });

  describe('form validation — required fields', () => {
    it('should be invalid when required fields are empty', () => {
      expect(component.form.invalid).toBeTrue();
    });

    it('should be valid when all required fields are filled with a valid pair and price', () => {
      component.form.setValue({
        pair: 'EURUSD',
        side: OrderSide.buy,
        type: OrderType.limit,
        amount: 10000,
        price: 1.0,
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
      component.form.patchValue({ pair: 'EURUSD' });
      component.form.get('pair')?.markAsTouched();

      expect(component.isInvalid('pair')).toBeFalse();
    });
  });

  describe('pair validation', () => {
    it('should show an invalidPair error for an unknown pair', () => {
      component.form.patchValue({ pair: 'GBPUSD' });
      component.form.get('pair')?.markAsTouched();

      expect(component.isInvalid('pair')).toBeTrue();
      expect(component.getPairError()).toContain('BTCUSD');
    });

    it('should reject the slash format (EUR/USD)', () => {
      component.form.patchValue({ pair: 'EUR/USD' });
      component.form.get('pair')?.markAsTouched();

      expect(component.form.get('pair')?.hasError('invalidPair')).toBeTrue();
    });

    it('should accept EURUSD, BTCUSD, and ETHUSD', () => {
      for (const pair of ['EURUSD', 'BTCUSD', 'ETHUSD']) {
        component.form.patchValue({ pair });
        expect(component.form.get('pair')?.hasError('invalidPair')).toBeFalse();
      }
    });
  });

  describe('cross-field price validation', () => {
    function touchAndDirtyPrice(): void {
      component.form.get('price')!.markAsTouched();
      component.form.get('price')!.markAsDirty();
      component.form.updateValueAndValidity();
    }

    it('should not show a cross-field price error in the UI before any related field is touched', () => {
      component.form.patchValue({
        pair: 'EURUSD',
        side: OrderSide.buy,
        type: OrderType.limit,
        price: 9999,
      });

      // The error is computed on the control immediately, but the UI must not
      // display it until the user has interacted with at least one related field.
      expect(component.showPriceCrossFieldError).toBeFalse();
    });

    it('should show a cross-field price error after a related field is touched', () => {
      component.form.patchValue({
        pair: 'EURUSD',
        side: OrderSide.buy,
        type: OrderType.limit,
        price: 9999,
      });
      component.form.get('type')!.markAsTouched();

      expect(component.showPriceCrossFieldError).toBeTrue();
    });

    it('should set limitBuyTooHigh when limit buy price is above market price', () => {
      const aboveMarket = MARKET_PRICES['EURUSD'] + 1;
      component.form.patchValue({ pair: 'EURUSD', side: OrderSide.buy, type: OrderType.limit, price: aboveMarket });
      touchAndDirtyPrice();

      expect(component.form.get('price')?.hasError('limitBuyTooHigh')).toBeTrue();
    });

    it('should not set limitBuyTooHigh when limit buy price is below market price', () => {
      const belowMarket = MARKET_PRICES['EURUSD'] - 0.001;
      component.form.patchValue({ pair: 'EURUSD', side: OrderSide.buy, type: OrderType.limit, price: belowMarket });
      touchAndDirtyPrice();

      expect(component.form.get('price')?.hasError('limitBuyTooHigh')).toBeFalse();
    });

    it('should set limitSellTooLow when limit sell price is below market price', () => {
      const belowMarket = MARKET_PRICES['EURUSD'] - 0.001;
      component.form.patchValue({ pair: 'EURUSD', side: OrderSide.sell, type: OrderType.limit, price: belowMarket });
      touchAndDirtyPrice();

      expect(component.form.get('price')?.hasError('limitSellTooLow')).toBeTrue();
    });

    it('should set stopBuyTooLow when stop buy price is below market price', () => {
      const belowMarket = MARKET_PRICES['EURUSD'] - 0.001;
      component.form.patchValue({ pair: 'EURUSD', side: OrderSide.buy, type: OrderType.stop, price: belowMarket });
      touchAndDirtyPrice();

      expect(component.form.get('price')?.hasError('stopBuyTooLow')).toBeTrue();
    });

    it('should set stopSellTooHigh when stop sell price is above market price', () => {
      const aboveMarket = MARKET_PRICES['EURUSD'] + 1;
      component.form.patchValue({ pair: 'EURUSD', side: OrderSide.sell, type: OrderType.stop, price: aboveMarket });
      touchAndDirtyPrice();

      expect(component.form.get('price')?.hasError('stopSellTooHigh')).toBeTrue();
    });

    it('should clear a cross-field error when the price becomes valid', () => {
      const aboveMarket = MARKET_PRICES['EURUSD'] + 1;
      component.form.patchValue({ pair: 'EURUSD', side: OrderSide.buy, type: OrderType.limit, price: aboveMarket });
      touchAndDirtyPrice();
      expect(component.form.get('price')?.hasError('limitBuyTooHigh')).toBeTrue();

      const belowMarket = MARKET_PRICES['EURUSD'] - 0.001;
      component.form.patchValue({ price: belowMarket });
      component.form.updateValueAndValidity();

      expect(component.form.get('price')?.hasError('limitBuyTooHigh')).toBeFalse();
    });

    it('should not set any price error for a market order regardless of price', () => {
      component.form.patchValue({ pair: 'EURUSD', side: OrderSide.buy, type: OrderType.market, price: 9999 });
      touchAndDirtyPrice();

      const priceControl = component.form.get('price')!;
      const hasCrossFieldError = ['limitBuyTooHigh', 'limitSellTooLow', 'stopBuyTooLow', 'stopSellTooHigh']
        .some(key => priceControl.hasError(key));
      expect(hasCrossFieldError).toBeFalse();
    });
  });

  describe('market order auto-fill and price disable', () => {
    it('should auto-fill the price with the market price when type changes to market', () => {
      component.form.patchValue({ pair: 'EURUSD', type: OrderType.market });

      expect(component.form.getRawValue().price).toBe(MARKET_PRICES['EURUSD']);
    });

    it('should disable the price control when type is market', () => {
      component.form.patchValue({ pair: 'EURUSD', type: OrderType.market });

      expect(component.form.get('price')!.disabled).toBeTrue();
    });

    it('should re-enable the price control when type changes away from market', () => {
      component.form.patchValue({ pair: 'EURUSD', type: OrderType.market });
      expect(component.form.get('price')!.disabled).toBeTrue();

      component.form.patchValue({ type: OrderType.limit });
      expect(component.form.get('price')!.disabled).toBeFalse();
    });

    it('should update the auto-filled price when the pair changes while type is market', () => {
      component.form.patchValue({ pair: 'EURUSD', type: OrderType.market });
      expect(component.form.getRawValue().price).toBe(MARKET_PRICES['EURUSD']);

      component.form.patchValue({ pair: 'BTCUSD' });
      expect(component.form.getRawValue().price).toBe(MARKET_PRICES['BTCUSD']);
    });
  });

  describe('isMarketOrder getter', () => {
    it('should return true when type is market', () => {
      component.form.patchValue({ type: OrderType.market });
      expect(component.isMarketOrder).toBeTrue();
    });

    it('should return false when type is limit', () => {
      component.form.patchValue({ type: OrderType.limit });
      expect(component.isMarketOrder).toBeFalse();
    });

    it('should return false when type is empty', () => {
      expect(component.isMarketOrder).toBeFalse();
    });
  });

  describe('onSubmit (create mode)', () => {
    it('should not dispatch when the form is invalid', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.onSubmit();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch createTrade with the correct DTO when the form is valid', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.form.setValue({
        pair: 'EURUSD',
        side: OrderSide.buy,
        type: OrderType.limit,
        amount: 10000,
        price: 1.0,
        status: '',
      });

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        createTrade({
          dto: {
            pair: 'EURUSD',
            side: OrderSide.buy,
            type: OrderType.limit,
            amount: 10000,
            price: 1.0,
          },
        })
      );
    });

    it('should include status in the DTO when it is selected', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.form.setValue({
        pair: 'EURUSD',
        side: OrderSide.sell,
        type: OrderType.limit,
        amount: 5000,
        price: 2.0,
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

    it('should navigate to /trades after updateTradeSuccess action', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      actions$.next(updateTradeSuccess({ trade: {} as any }));

      expect(router.navigate).toHaveBeenCalledWith(['/trades']);
    });
  });

  describe('template', () => {
    it('should show an ErrorModal when submitError$ emits', async () => {
      mockSelectCreateError.setResult({ kind: 'api', message: 'Server error' });
      store.refreshState();
      fixture.detectChanges();
      await fixture.whenStable();

      const modal = fixture.nativeElement.querySelector('app-error-modal');
      expect(modal).not.toBeNull();
    });

    it('should disable the submit button when submitting$ is true', async () => {
      mockSelectCreating.setResult(true);
      store.refreshState();
      fixture.detectChanges();
      await fixture.whenStable();

      const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn.disabled).toBeTrue();
    });

    it('should disable the submit button when the form is invalid', () => {
      // Form is invalid by default (required fields empty)
      fixture.detectChanges();

      const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn.disabled).toBeTrue();
    });

    it('should enable the submit button when the form is valid', async () => {
      component.form.setValue({
        pair: 'EURUSD',
        side: OrderSide.buy,
        type: OrderType.limit,
        amount: 10000,
        price: 1.0,
        status: OrderStatus.open,
      });
      fixture.detectChanges();
      await fixture.whenStable();

      const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn.disabled).toBeFalse();
    });

    it('should show the submit button in create mode', () => {
      const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn).not.toBeNull();
    });

    it('should show the market price info message when type is market', async () => {
      component.form.patchValue({ pair: 'EURUSD', type: OrderType.market });
      fixture.detectChanges();
      await fixture.whenStable();

      const info = fixture.nativeElement.querySelector('.trade-form__info');
      expect(info).not.toBeNull();
      expect(info.textContent).toContain('market price');
    });

    it('should render a select with all valid pair options', () => {
      const select = fixture.nativeElement.querySelector('#pair');
      const options: HTMLOptionElement[] = Array.from(select.querySelectorAll('option[value]:not([value=""])'));
      expect(options.map((o: HTMLOptionElement) => o.value)).toEqual(['BTCUSD', 'EURUSD', 'ETHUSD']);
    });
  });
});
