import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';

@Injectable({ providedIn: 'root' })
export class TradesService {
  private readonly apiUrl = `${environment.apiUrl}/trade_orders`;

  constructor(private readonly http: HttpClient) {}

  getTrades(): Observable<TradeOrder[]> {
    return this.http.get<TradeOrder[]>(this.apiUrl);
  }

  createTrade(dto: CreateTradeDto): Observable<TradeOrder> {
    return this.http.post<TradeOrder>(this.apiUrl, dto);
  }
}
