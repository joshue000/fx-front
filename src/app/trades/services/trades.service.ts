import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
import { PaginatedResponse } from '../../core/models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class TradesService {
  private readonly apiUrl = `${environment.apiUrl}/trade_orders`;

  constructor(private readonly http: HttpClient) {}

  getTrades(page: number, limit: number): Observable<PaginatedResponse<TradeOrder>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<TradeOrder>>(this.apiUrl, { params });
  }

  createTrade(dto: CreateTradeDto): Observable<TradeOrder> {
    return this.http.post<TradeOrder>(this.apiUrl, dto);
  }
}
