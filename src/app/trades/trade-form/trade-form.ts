import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
import { UpdateTradeDto } from '../../core/dtos/update-trade.dto';
import {
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

export type TradeFormMode = 'create' | 'view' | 'edit';

@Component({
  selector: 'app-trade-form',
  imports: [ReactiveFormsModule, AsyncPipe, UpperCasePipe],
  templateUrl: './trade-form.html',
  styleUrl: './trade-form.scss',
})
export class TradeForm implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly actions$ = inject(Actions);

  readonly mode: TradeFormMode = this.route.snapshot.data['mode'] ?? 'create';
  readonly tradeId: string | null = this.route.snapshot.paramMap.get('id');

  readonly loadingOne$: Observable<boolean> = this.store.select(selectTradesLoadingOne);
  readonly loadOneError$: Observable<string | null> = this.store.select(selectTradesLoadOneError);

  readonly submitting$: Observable<boolean> = this.mode === 'edit'
    ? this.store.select(selectTradesUpdating)
    : this.store.select(selectTradesCreating);

  readonly submitError$: Observable<string | null> = this.mode === 'edit'
    ? this.store.select(selectTradesUpdateError)
    : this.store.select(selectTradesCreateError);

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

    this.actions$
      .pipe(ofType(updateTradeSuccess), takeUntilDestroyed())
      .subscribe(() => this.router.navigate(['/trades']));
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

  goBack(): void {
    this.router.navigate(['/trades']);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
