import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { AppError } from '../../core/models/app-error.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
import { UpdateTradeDto } from '../../core/dtos/update-trade.dto';
import { MARKET_PRICES, VALID_PAIRS } from '../../core/constants/market-prices.constant';
import {
  clearTradesErrors,
  createTrade,
  createTradeSuccess,
  loadTrade,
  updateTrade,
  updateTradeSuccess,
} from '../store/trades.actions';
import {
  selectSelectedTrade,
  selectTradesCreateError,
  selectTradesCreating,
  selectTradesLoadOneError,
  selectTradesLoadingOne,
  selectTradesUpdateError,
  selectTradesUpdating,
} from '../store/trades.selectors';
import { orderPriceGroupValidator, validPairValidator } from './validators/order-price.validator';
import { PRICE_CROSS_FIELD_ERROR_KEYS } from './validators/order-price.validator';
import { ErrorModal } from '../../shared/error-modal/error-modal';
import { ConnectionError } from '../../shared/connection-error/connection-error';
import { Toast } from '../../shared/toast/toast';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TranslationService } from '../../core/i18n/translation.service';

export type TradeFormMode = 'create' | 'view' | 'edit';

@Component({
  selector: 'app-trade-form',
  imports: [ReactiveFormsModule, AsyncPipe, ErrorModal, ConnectionError, Toast, TranslatePipe],
  templateUrl: './trade-form.html',
  styleUrl: './trade-form.scss',
})
export class TradeForm implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly actions$ = inject(Actions);
  private readonly translationService = inject(TranslationService);

  readonly mode: TradeFormMode = this.route.snapshot.data['mode'] ?? 'create';
  readonly tradeId: string | null = this.route.snapshot.paramMap.get('id');

  readonly loadingOne$: Observable<boolean> = this.store.select(selectTradesLoadingOne);

  private readonly loadOneError$ = this.store.select(selectTradesLoadOneError);
  readonly isNetworkLoadError$: Observable<boolean> = this.loadOneError$.pipe(
    map(e => e?.kind === 'network')
  );
  readonly apiLoadError$: Observable<AppError | null> = this.loadOneError$.pipe(
    map(e => e?.kind === 'api' ? e : null)
  );

  private readonly rawSubmitError$: Observable<AppError | null> = this.mode === 'edit'
    ? this.store.select(selectTradesUpdateError)
    : this.store.select(selectTradesCreateError);
  readonly submitError$: Observable<AppError | null> = this.rawSubmitError$;

  readonly submitting$: Observable<boolean> = this.mode === 'edit'
    ? this.store.select(selectTradesUpdating)
    : this.store.select(selectTradesCreating);

  readonly orderSides = Object.values(OrderSide);
  readonly orderTypes = Object.values(OrderType);
  readonly orderStatuses = Object.values(OrderStatus);
  readonly validPairs = VALID_PAIRS;

  readonly form = this.fb.group(
    {
      pair: ['', [Validators.required, validPairValidator]],
      side: ['' as OrderSide | '', [Validators.required]],
      type: ['' as OrderType | '', [Validators.required]],
      amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
      price: [null as number | null, [Validators.required, Validators.min(0.0001)]],
      status: [OrderStatus.open as OrderStatus | ''],
    },
    { validators: [orderPriceGroupValidator] },
  );

  showToast = false;
  toastMessage = '';
  submitted = false;

  constructor() {
    this.actions$
      .pipe(ofType(createTradeSuccess), takeUntilDestroyed())
      .subscribe(() => {
        this.submitted = true;
        this.toastMessage = 'tradeForm.toast.created';
        this.showToast = true;
      });

    this.actions$
      .pipe(ofType(updateTradeSuccess), takeUntilDestroyed())
      .subscribe(() => {
        this.submitted = true;
        this.toastMessage = 'tradeForm.toast.updated';
        this.showToast = true;
      });

    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.syncMarketPrice());
  }

  ngOnInit(): void {
    if ((this.mode === 'view' || this.mode === 'edit') && this.tradeId) {
      this.store.dispatch(loadTrade({ id: this.tradeId }));

      this.store
        .select(selectSelectedTrade)
        .pipe(
          filter((trade): trade is TradeOrder => trade !== null),
          take(1)
        )
        .subscribe(trade => {
          this.form.patchValue({
            pair: trade.pair,
            side: trade.side,
            type: trade.type,
            amount: Number(trade.amount),
            price: Number(trade.price),
            status: trade.status ?? '',
          });

          if (this.mode === 'view') {
            this.form.disable();
          } else if (trade.type === OrderType.market) {
            this.form.get('price')!.disable({ emitEvent: false });
          }
        });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { pair, side, type, amount, price, status } = this.form.getRawValue();

    if (this.mode === 'edit' && this.tradeId) {
      const dto: UpdateTradeDto = {
        pair: pair!,
        side: side as OrderSide,
        type: type as OrderType,
        amount: Number(amount),
        price: Number(price),
        ...(status ? { status: status as OrderStatus } : {}),
      };
      this.store.dispatch(updateTrade({ id: this.tradeId, dto }));
    } else {
      const dto: CreateTradeDto = {
        pair: pair!,
        side: side as OrderSide,
        type: type as OrderType,
        amount: Number(amount),
        price: Number(price),
        ...(status ? { status: status as OrderStatus } : {}),
      };
      this.store.dispatch(createTrade({ dto }));
    }
  }

  onRetry(): void {
    if (this.tradeId) {
      this.store.dispatch(loadTrade({ id: this.tradeId }));
    }
  }

  onToastDismissed(): void {
    this.router.navigate(['/trades']);
  }

  onSubmitErrorDismissed(): void {
    this.store.dispatch(clearTradesErrors());
  }

  onLoadErrorDismissed(): void {
    this.store.dispatch(clearTradesErrors());
  }

  goBack(): void {
    this.router.navigate(['/trades']);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getPairError(): string | null {
    const control = this.form.get('pair')!;
    if (!control.errors) return null;
    if (control.errors['required']) return this.translationService.translate('tradeForm.error.pairRequired');
    if (control.errors['invalidPair']) {
      return this.translationService.translate('tradeForm.error.invalidPair', { pairs: this.validPairs.join(', ') });
    }
    return null;
  }

  getPriceError(): string | null {
    const control = this.form.get('price')!;
    if (!control.errors) return null;
    if (control.errors['required']) return this.translationService.translate('tradeForm.error.priceRequired');
    if (control.errors['min']) return this.translationService.translate('tradeForm.error.priceTooLow');
    if (control.errors['limitBuyTooHigh']) {
      return this.translationService.translate('tradeForm.error.limitBuyTooHigh', { price: control.errors['limitBuyTooHigh'].marketPrice });
    }
    if (control.errors['limitSellTooLow']) {
      return this.translationService.translate('tradeForm.error.limitSellTooLow', { price: control.errors['limitSellTooLow'].marketPrice });
    }
    if (control.errors['stopBuyTooLow']) {
      return this.translationService.translate('tradeForm.error.stopBuyTooLow', { price: control.errors['stopBuyTooLow'].marketPrice });
    }
    if (control.errors['stopSellTooHigh']) {
      return this.translationService.translate('tradeForm.error.stopSellTooHigh', { price: control.errors['stopSellTooHigh'].marketPrice });
    }
    return null;
  }

  get isMarketOrder(): boolean {
    return this.form.get('type')?.value === OrderType.market;
  }

  /**
   * True when a cross-field price error should be displayed in the UI.
   * The error is always computed by the validator, but shown only after
   * the user has interacted with at least one related field (pair, side,
   * type, or price itself), preventing premature error display on load.
   */
  get showPriceCrossFieldError(): boolean {
    const priceControl = this.form.get('price')!;
    if (priceControl.value == null) return false;
    const hasCrossFieldError = PRICE_CROSS_FIELD_ERROR_KEYS.some(key => priceControl.hasError(key));
    if (!hasCrossFieldError) return false;
    return ['pair', 'side', 'type'].some(f => this.form.get(f)?.touched) || priceControl.touched;
  }

  private syncMarketPrice(): void {
    if (this.mode === 'view') return;

    const priceControl = this.form.get('price')!;
    const type = this.form.get('type')!.value;

    if (type === OrderType.market) {
      const pair = this.form.get('pair')!.value;
      const marketPrice = pair ? (MARKET_PRICES[pair] ?? null) : null;

      if (marketPrice !== null) {
        priceControl.setValue(marketPrice, { emitEvent: false });
      }

      if (!priceControl.disabled) {
        priceControl.disable({ emitEvent: false });
        const errors = { ...(priceControl.errors ?? {}) };
        PRICE_CROSS_FIELD_ERROR_KEYS.forEach(key => delete errors[key]);
        priceControl.setErrors(Object.keys(errors).length ? errors : null, { emitEvent: false });
      }
    } else {
      if (priceControl.disabled) {
        priceControl.enable({ emitEvent: false });
      }
    }
  }
}
