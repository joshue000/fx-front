import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TradesService } from './trades.service';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeDto } from '../../core/dtos/create-trade.dto';
import { PaginatedResponse, PaginationMetadata } from '../../core/models/paginated-response.model';
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

const mockPagination: PaginationMetadata = {
  page: 1,
  limit: 10,
  total: 24,
  totalPages: 3,
};

const mockResponse: PaginatedResponse<TradeOrder> = {
  data: mockTrades,
  metadata: mockPagination,
};

describe('TradesService', () => {
  let service: TradesService;
  let httpController: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/trade_orders`;

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
    it('should perform a GET request with page and limit query params', () => {
      service.getTrades(1, 10).subscribe();

      const req = httpController.expectOne(r => r.url === baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('limit')).toBe('10');

      req.flush(mockResponse);
    });

    it('should return the paginated response from the API', (done) => {
      service.getTrades(1, 10).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      httpController.expectOne(r => r.url === baseUrl).flush(mockResponse);
    });

    it('should pass the correct page number to the request', () => {
      service.getTrades(3, 10).subscribe();

      const req = httpController.expectOne(r => r.url === baseUrl);
      expect(req.request.params.get('page')).toBe('3');

      req.flush({ data: [], metadata: { ...mockPagination, page: 3 } });
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

      const req = httpController.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');

      req.flush(createdTrade);
    });

    it('should send the DTO as the request body', () => {
      service.createTrade(mockDto).subscribe();

      const req = httpController.expectOne(baseUrl);
      expect(req.request.body).toEqual(mockDto);

      req.flush(createdTrade);
    });

    it('should return the created trade from the API', (done) => {
      service.createTrade(mockDto).subscribe((trade) => {
        expect(trade).toEqual(createdTrade);
        done();
      });

      httpController.expectOne(baseUrl).flush(createdTrade);
    });
  });
});
