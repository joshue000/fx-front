import { Component, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { TradeOrder, OrderSide, OrderType, OrderStatus } from '../../core/models/trade-order.model';

@Component({
  selector: 'app-orders-list',
  imports: [UpperCasePipe],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss'
})
export class OrdersList {
  private readonly router = inject(Router);

  readonly orders: TradeOrder[] = [
    {
      id: '1',
      pair: 'EUR/USD',
      side: OrderSide.buy,
      type: OrderType.limit,
      amount: '10000',
      price: '1.0850',
      status: OrderStatus.open,
      createdAt: new Date('2026-03-10T09:00:00'),
      updatedAt: new Date('2026-03-10T09:00:00'),
    },
    {
      id: '2',
      pair: 'GBP/USD',
      side: OrderSide.sell,
      type: OrderType.market,
      amount: '5000',
      price: '1.2640',
      status: OrderStatus.executed,
      createdAt: new Date('2026-03-11T14:30:00'),
      updatedAt: new Date('2026-03-11T14:31:00'),
    },
    {
      id: '3',
      pair: 'USD/JPY',
      side: OrderSide.buy,
      type: OrderType.stop,
      amount: '20000',
      price: '149.50',
      status: OrderStatus.cancelled,
      createdAt: new Date('2026-03-12T11:15:00'),
      updatedAt: new Date('2026-03-12T11:20:00'),
    },
    {
      id: '4',
      pair: 'AUD/USD',
      side: OrderSide.sell,
      type: OrderType.limit,
      amount: '8000',
      price: '0.6510',
      status: OrderStatus.open,
      createdAt: new Date('2026-03-15T08:45:00'),
      updatedAt: new Date('2026-03-15T08:45:00'),
    },
  ];

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
