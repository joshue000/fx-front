import { OrderSide, OrderStatus, OrderType } from '../models/trade-order.model';

export interface CreateTradeOrderDto {
  side: OrderSide;
  type: OrderType;
  amount: number;
  price: number;
  status?: OrderStatus;
  pair: string;
}
