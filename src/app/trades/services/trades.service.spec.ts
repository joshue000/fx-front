import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TradesService } from './trades.service';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
import { environment } from '../../../environments/environment';

const mockTrades: TradeOrder[] = [
  {
    id: '1',
    pair: 'EUR/USD',
    side: OrderSide.buy,
    type: OrderType.limit,
    amount: '10000',
    price: '1.0850',
    status: OrderStatus.open,
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    id: '2',
    pair: 'GBP/USD',
    side: OrderSide.sell,
    type: OrderType.market,
    amount: '5000',
    price: '1.2640',
    status: OrderStatus.executed,
    createdAt: new Date('2026-03-11'),
    updatedAt: new Date('2026-03-11'),
  },
];

describe('TradesService', () => {
  let service: TradesService;
  let httpController: HttpTestingController;

  const expectedUrl = `${environment.apiUrl}/trade_orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TradesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTrades', () => {
    it('should perform a GET request to the trade_orders endpoint', () => {
      service.getTrades().subscribe();

      const req = httpController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');

      req.flush([]);
    });

    it('should return the list of trades from the API', (done) => {
      service.getTrades().subscribe((trades) => {
        expect(trades).toEqual(mockTrades);
        done();
      });

      httpController.expectOne(expectedUrl).flush(mockTrades);
    });

    it('should return an empty array when the API responds with no trades', (done) => {
      service.getTrades().subscribe((trades) => {
        expect(trades).toEqual([]);
        done();
      });

      httpController.expectOne(expectedUrl).flush([]);
    });
  });

  describe('createTrade', () => {
    const mockDto: CreateTradeDto = {
      pair: 'EUR/USD',
      side: OrderSide.buy,
      type: OrderType.limit,
      amount: 10000,
      price: 1.085,
    };

    const createdTrade: TradeOrder = {
      id: '99',
      pair: 'EUR/USD',
      side: OrderSide.buy,
      type: OrderType.limit,
      amount: '10000',
      price: '1.085',
      status: OrderStatus.open,
      createdAt: new Date('2026-03-17'),
      updatedAt: new Date('2026-03-17'),
    };

    it('should perform a POST request to the trade_orders endpoint', () => {
      service.createTrade(mockDto).subscribe();

      const req = httpController.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');

      req.flush(createdTrade);
    });

    it('should send the DTO as the request body', () => {
      service.createTrade(mockDto).subscribe();

      const req = httpController.expectOne(expectedUrl);
      expect(req.request.body).toEqual(mockDto);

      req.flush(createdTrade);
    });

    it('should return the created trade from the API', (done) => {
      service.createTrade(mockDto).subscribe((trade) => {
        expect(trade).toEqual(createdTrade);
        done();
      });

      httpController.expectOne(expectedUrl).flush(createdTrade);
    });
  });
});
