import { OrderSide, OrderStatus, OrderType } from '../models/trade-order.model';

export interface UpdateTradeDto {
  pair?: string;
  side?: OrderSide;
  type?: OrderType;
  amount?: number;
  price?: number;
  status?: OrderStatus;
}
