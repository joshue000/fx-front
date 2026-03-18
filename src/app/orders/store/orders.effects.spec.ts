import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of, throwError } from 'rxjs';

import { OrdersEffects } from './orders.effects';
import { OrdersService } from '../services/orders.service';
import {
  createOrder,
  createOrderFailure,
  createOrderSuccess,
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess,
} from './orders.actions';
import { OrderSide, OrderStatus, OrderType, TradeOrder } from '../../core/models/trade-order.model';
import { CreateTradeOrderDto } from '../../core/dtos/create-trade-order.dto';

const mockOrder: TradeOrder = {
  id: '1',
  pair: 'EUR/USD',
  side: OrderSide.buy,
  type: OrderType.limit,
  amount: '10000',
  price: '1.0850',
  status: OrderStatus.open,
  createdAt: new Date('2026-03-10'),
  updatedAt: new Date('2026-03-10'),
};

describe('OrdersEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: OrdersEffects;
  let ordersServiceSpy: jasmine.SpyObj<OrdersService>;

  beforeEach(() => {
    actions$ = new ReplaySubject<Action>(1);
    ordersServiceSpy = jasmine.createSpyObj<OrdersService>('OrdersService', ['getOrders', 'createOrder']);

    TestBed.configureTestingModule({
      providers: [
        OrdersEffects,
        provideMockActions(() => actions$),
        { provide: OrdersService, useValue: ordersServiceSpy },
      ],
    });

    effects = TestBed.inject(OrdersEffects);
  });

  describe('loadOrders$', () => {
    it('should dispatch loadOrdersSuccess when the service returns data', (done) => {
      ordersServiceSpy.getOrders.and.returnValue(of([mockOrder]));

      effects.loadOrders$.subscribe((action) => {
        expect(action).toEqual(loadOrdersSuccess({ orders: [mockOrder] }));
        done();
      });

      actions$.next(loadOrders());
    });

    it('should dispatch loadOrdersFailure when the service throws an error', (done) => {
      const errorMessage = 'Http failure response';
      ordersServiceSpy.getOrders.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      effects.loadOrders$.subscribe((action) => {
        expect(action).toEqual(loadOrdersFailure({ error: errorMessage }));
        done();
      });

      actions$.next(loadOrders());
    });

    it('should call OrdersService.getOrders once per loadOrders action', (done) => {
      ordersServiceSpy.getOrders.and.returnValue(of([mockOrder]));

      effects.loadOrders$.subscribe(() => {
        expect(ordersServiceSpy.getOrders).toHaveBeenCalledTimes(1);
        done();
      });

      actions$.next(loadOrders());
    });
  });

  describe('createOrder$', () => {
    const mockDto: CreateTradeOrderDto = {
      pair: 'EUR/USD',
      side: OrderSide.buy,
      type: OrderType.limit,
      amount: 10000,
      price: 1.085,
    };

    it('should dispatch createOrderSuccess when the service returns the created order', (done) => {
      ordersServiceSpy.createOrder.and.returnValue(of(mockOrder));

      effects.createOrder$.subscribe((action) => {
        expect(action).toEqual(createOrderSuccess({ order: mockOrder }));
        done();
      });

      actions$.next(createOrder({ dto: mockDto }));
    });

    it('should dispatch createOrderFailure when the service throws an error', (done) => {
      const errorMessage = 'Validation failed';
      ordersServiceSpy.createOrder.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      effects.createOrder$.subscribe((action) => {
        expect(action).toEqual(createOrderFailure({ error: errorMessage }));
        done();
      });

      actions$.next(createOrder({ dto: mockDto }));
    });

    it('should call OrdersService.createOrder with the provided DTO', (done) => {
      ordersServiceSpy.createOrder.and.returnValue(of(mockOrder));

      effects.createOrder$.subscribe(() => {
        expect(ordersServiceSpy.createOrder).toHaveBeenCalledWith(mockDto);
        done();
      });

      actions$.next(createOrder({ dto: mockDto }));
    });
  });
});
