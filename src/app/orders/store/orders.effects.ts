import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { OrdersService } from '../services/orders.service';
import {
  createOrder,
  createOrderFailure,
  createOrderSuccess,
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess,
} from './orders.actions';

@Injectable()
export class OrdersEffects {
  private readonly actions$ = inject(Actions);
  private readonly ordersService = inject(OrdersService);

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrders),
      switchMap(() =>
        this.ordersService.getOrders().pipe(
          map(orders => loadOrdersSuccess({ orders })),
          catchError(error => of(loadOrdersFailure({ error: error.message })))
        )
      )
    )
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrder),
      switchMap(({ dto }) =>
        this.ordersService.createOrder(dto).pipe(
          map(order => createOrderSuccess({ order })),
          catchError(error => of(createOrderFailure({ error: error.message })))
        )
      )
    )
  );
}
