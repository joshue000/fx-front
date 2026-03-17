import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TradeOrder } from '../../core/models/trade-order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly apiUrl = `${environment.apiUrl}/trade_orders`;

  constructor(private readonly http: HttpClient) {}

  getOrders(): Observable<TradeOrder[]> {
    return this.http.get<TradeOrder[]>(this.apiUrl);
  }
}
