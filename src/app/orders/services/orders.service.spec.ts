import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { OrdersService } from './orders.service';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { environment } from '../../../environments/environment';

const mockOrders: TradeOrder[] = [
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

describe('OrdersService', () => {
  let service: OrdersService;
  let httpController: HttpTestingController;

  const expectedUrl = `${environment.apiUrl}/trade_orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(OrdersService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrders', () => {
    it('should perform a GET request to the trade_orders endpoint', () => {
      service.getOrders().subscribe();

      const req = httpController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');

      req.flush([]);
    });

    it('should return the list of trade orders from the API', (done) => {
      service.getOrders().subscribe((orders) => {
        expect(orders).toEqual(mockOrders);
        done();
      });

      httpController.expectOne(expectedUrl).flush(mockOrders);
    });

    it('should return an empty array when the API responds with no orders', (done) => {
      service.getOrders().subscribe((orders) => {
        expect(orders).toEqual([]);
        done();
      });

      httpController.expectOne(expectedUrl).flush([]);
    });
  });
});
