import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TradeOrder } from '../../core/models/trade-order.model';
import { PaginationMetadata } from '../../core/models/paginated-response.model';
import { deleteTrade, deleteTradeSuccess, loadTrades } from '../store/trades.actions';
import {
  selectTrades,
  selectTradesError,
  selectTradesLoading,
  selectTradesPagination,
} from '../store/trades.selectors';
import { Pagination } from '../../shared/pagination/pagination';
import { PageSizeSelector } from '../../shared/page-size-selector/page-size-selector';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';

export const DEFAULT_PAGE_SIZE = 5;

@Component({
  selector: 'app-trades-list',
  imports: [AsyncPipe, UpperCasePipe, Pagination, PageSizeSelector, ConfirmModal],
  templateUrl: './trades-list.html',
  styleUrl: './trades-list.scss'
})
export class TradesList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly actions$ = inject(Actions);

  readonly trades$: Observable<TradeOrder[]> = this.store.select(selectTrades);
  readonly loading$: Observable<boolean> = this.store.select(selectTradesLoading);
  readonly error$: Observable<string | null> = this.store.select(selectTradesError);
  readonly pagination$: Observable<PaginationMetadata | null> = this.store.select(selectTradesPagination);

  currentPageSize = DEFAULT_PAGE_SIZE;
  showDeleteModal = false;
  deleteTargetId: string | null = null;

  constructor() {
    this.actions$
      .pipe(ofType(deleteTradeSuccess), takeUntilDestroyed())
      .subscribe(() => {
        this.showDeleteModal = false;
        this.deleteTargetId = null;
        this.store.dispatch(loadTrades({ page: 1, limit: this.currentPageSize }));
      });
  }

  ngOnInit(): void {
    this.store.dispatch(loadTrades({ page: 1, limit: this.currentPageSize }));
  }

  trackById(_index: number, trade: TradeOrder): string {
    return trade.id;
  }

  onPageChange(page: number): void {
    this.store.dispatch(loadTrades({ page, limit: this.currentPageSize }));
  }

  onPageSizeChange(limit: number): void {
    this.currentPageSize = limit;
    this.store.dispatch(loadTrades({ page: 1, limit }));
  }

  goToDetail(id: string): void {
    this.router.navigate(['/trades', id]);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/trades', id, 'edit']);
  }

  onDelete(id: string): void {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  onDeleteConfirmed(): void {
    if (this.deleteTargetId) {
      this.store.dispatch(deleteTrade({ id: this.deleteTargetId }));
    }
  }

  onDeleteCancelled(): void {
    this.showDeleteModal = false;
    this.deleteTargetId = null;
  }

  goToCreate(): void {
    this.router.navigate(['/trades', 'new']);
  }
}
