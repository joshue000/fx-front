import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';

import { AppError } from '../../core/models/app-error.model';
import { TradesService } from '../services/trades.service';
import { DEFAULT_PAGE_SIZE } from '../constants/trades.constants';
import {
  createTrade,
  createTradeFailure,
  createTradeSuccess,
  deleteTrade,
  deleteTradeFailure,
  deleteTradeSuccess,
  loadTrade,
  loadTradeFailure,
  loadTradeSuccess,
  loadTrades,
  loadTradesFailure,
  loadTradesSuccess,
  updateTrade,
  updateTradeFailure,
  updateTradeSuccess,
} from './trades.actions';
import { selectTradesPagination } from './trades.selectors';

function toAppError(err: HttpErrorResponse): AppError {
  if (err.status === 0) {
    return { kind: 'network', message: 'Unable to reach the server. Please check your connection.' };
  }
  const message: string = err.error?.message ?? err.error?.error ?? `Server error (${err.status})`;
  return { kind: 'api', message };
}

@Injectable()
export class TradesEffects {
  private readonly actions$ = inject(Actions);
  private readonly tradesService = inject(TradesService);
  private readonly store = inject(Store);

  loadTrades$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTrades),
      switchMap(({ page, limit }) =>
        this.tradesService.getTrades(page, limit).pipe(
          map(response => loadTradesSuccess({ trades: response.data, pagination: response.metadata })),
          catchError((err: HttpErrorResponse) => of(loadTradesFailure({ error: toAppError(err) })))
        )
      )
    )
  );

  loadTrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTrade),
      switchMap(({ id }) =>
        this.tradesService.getTradeById(id).pipe(
          map(trade => loadTradeSuccess({ trade })),
          catchError((err: HttpErrorResponse) => of(loadTradeFailure({ error: toAppError(err) })))
        )
      )
    )
  );

  createTrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTrade),
      switchMap(({ dto }) =>
        this.tradesService.createTrade(dto).pipe(
          map(trade => createTradeSuccess({ trade })),
          catchError((err: HttpErrorResponse) => of(createTradeFailure({ error: toAppError(err) })))
        )
      )
    )
  );

  updateTrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTrade),
      switchMap(({ id, dto }) =>
        this.tradesService.updateTrade(id, dto).pipe(
          map(trade => updateTradeSuccess({ trade })),
          catchError((err: HttpErrorResponse) => of(updateTradeFailure({ error: toAppError(err) })))
        )
      )
    )
  );

  deleteTrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTrade),
      switchMap(({ id }) =>
        this.tradesService.deleteTrade(id).pipe(
          map(() => deleteTradeSuccess({ id })),
          catchError((err: HttpErrorResponse) => of(deleteTradeFailure({ error: toAppError(err) })))
        )
      )
    )
  );

  reloadAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTradeSuccess),
      withLatestFrom(this.store.select(selectTradesPagination)),
      map(([, pagination]) => loadTrades({ page: 1, limit: pagination?.limit ?? DEFAULT_PAGE_SIZE }))
    )
  );
}
