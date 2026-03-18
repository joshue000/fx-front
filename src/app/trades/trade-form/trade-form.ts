import { Component, inject } from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrderSide, OrderStatus, OrderType } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
import { createTrade, createTradeSuccess } from '../store/trades.actions';
import { selectTradesCreateError, selectTradesCreating } from '../store/trades.selectors';

@Component({
  selector: 'app-trade-form',
  imports: [ReactiveFormsModule, AsyncPipe, UpperCasePipe],
  templateUrl: './trade-form.html',
  styleUrl: './trade-form.scss',
})
export class TradeForm {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly actions$ = inject(Actions);

  readonly creating$: Observable<boolean> = this.store.select(selectTradesCreating);
  readonly createError$: Observable<string | null> = this.store.select(selectTradesCreateError);

  readonly orderSides = Object.values(OrderSide);
  readonly orderTypes = Object.values(OrderType);
  readonly orderStatuses = Object.values(OrderStatus);

  readonly form = this.fb.group({
    pair: ['', [Validators.required]],
    side: ['' as OrderSide | '', [Validators.required]],
    type: ['' as OrderType | '', [Validators.required]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    status: ['' as OrderStatus | ''],
  });

  constructor() {
    this.actions$
      .pipe(ofType(createTradeSuccess), takeUntilDestroyed())
      .subscribe(() => this.router.navigate(['/trades']));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { pair, side, type, amount, price, status } = this.form.getRawValue();

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

  goBack(): void {
    this.router.navigate(['/trades']);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
