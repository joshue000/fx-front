import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TradeOrder } from '../../core/models/trade-order.model';
import { loadTrades } from '../store/trades.actions';
import { selectTrades, selectTradesError, selectTradesLoading } from '../store/trades.selectors';

@Component({
  selector: 'app-trades-list',
  imports: [AsyncPipe, UpperCasePipe],
  templateUrl: './trades-list.html',
  styleUrl: './trades-list.scss'
})
export class TradesList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly trades$: Observable<TradeOrder[]> = this.store.select(selectTrades);
  readonly loading$: Observable<boolean> = this.store.select(selectTradesLoading);
  readonly error$: Observable<string | null> = this.store.select(selectTradesError);

  ngOnInit(): void {
    this.store.dispatch(loadTrades());
  }

  trackById(_index: number, trade: TradeOrder): string {
    return trade.id;
  }

  goToDetail(id: string): void {
    this.router.navigate(['/trades', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/trades', 'new']);
  }
}
