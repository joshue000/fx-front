import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TradeOrder } from '../../core/models/trade-order.model';
import { loadOrders } from '../store/orders.actions';
import { selectOrders, selectOrdersError, selectOrdersLoading } from '../store/orders.selectors';

@Component({
  selector: 'app-orders-list',
  imports: [AsyncPipe, UpperCasePipe],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss'
})
export class OrdersList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly orders$: Observable<TradeOrder[]> = this.store.select(selectOrders);
  readonly loading$: Observable<boolean> = this.store.select(selectOrdersLoading);
  readonly error$: Observable<string | null> = this.store.select(selectOrdersError);

  ngOnInit(): void {
    this.store.dispatch(loadOrders());
  }

  trackById(_index: number, order: TradeOrder): string {
    return order.id;
  }

  goToDetail(id: string): void {
    this.router.navigate(['/orders', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/orders', 'new']);
  }
}
