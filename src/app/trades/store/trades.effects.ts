import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { TradesService } from '../services/trades.service';
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

@Injectable()
export class TradesEffects {
  private readonly actions$ = inject(Actions);
  private readonly tradesService = inject(TradesService);

  loadTrades$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTrades),
      switchMap(({ page, limit }) =>
        this.tradesService.getTrades(page, limit).pipe(
          map(response => loadTradesSuccess({ trades: response.data, pagination: response.metadata })),
          catchError(error => of(loadTradesFailure({ error: error.message })))
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
          catchError(error => of(loadTradeFailure({ error: error.message })))
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
          catchError(error => of(createTradeFailure({ error: error.message })))
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
          catchError(error => of(updateTradeFailure({ error: error.message })))
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
          catchError(error => of(deleteTradeFailure({ error: error.message })))
        )
      )
    )
  );
}
