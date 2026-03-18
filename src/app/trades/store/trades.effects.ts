import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { TradesService } from '../services/trades.service';
import {
  createTrade,
  createTradeFailure,
  createTradeSuccess,
  loadTrades,
  loadTradesFailure,
  loadTradesSuccess,
} from './trades.actions';

@Injectable()
export class TradesEffects {
  private readonly actions$ = inject(Actions);
  private readonly tradesService = inject(TradesService);

  loadTrades$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTrades),
      switchMap(() =>
        this.tradesService.getTrades().pipe(
          map(trades => loadTradesSuccess({ trades })),
          catchError(error => of(loadTradesFailure({ error: error.message })))
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
}
