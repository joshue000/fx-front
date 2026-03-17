export enum OrderSide {
  buy = 'buy',
  sell = 'sell'
}

export enum OrderType {
  limit = 'limit',
  market = 'market',
  stop = 'stop'
}

export enum OrderStatus {
  open = 'open',
  cancelled = 'cancelled',
  executed = 'executed'
}

export interface TradeOrder {
  id: string;
  side: OrderSide;
  type: OrderType;
  amount: string;
  price: string;
  status: OrderStatus;
  pair: string;
  createdAt: Date;
  updatedAt: Date;
}
