import { FormControl } from '@angular/forms';

import { MARKET_PRICES } from '../../../core/constants/market-prices.constant';
import { validateOrderPrice, validPairValidator } from './order-price.validator';

describe('validateOrderPrice', () => {
  const BTCUSD = MARKET_PRICES['BTCUSD'];
  const EURUSD = MARKET_PRICES['EURUSD'];

  describe('returns null when inputs are incomplete', () => {
    it('should return null when pair is null', () => {
      expect(validateOrderPrice(null, 'buy', 'limit', 1.0)).toBeNull();
    });

    it('should return null when side is null', () => {
      expect(validateOrderPrice('EURUSD', null, 'limit', 1.0)).toBeNull();
    });

    it('should return null when type is null', () => {
      expect(validateOrderPrice('EURUSD', 'buy', null, 1.0)).toBeNull();
    });

    it('should return null when price is null', () => {
      expect(validateOrderPrice('EURUSD', 'buy', 'limit', null)).toBeNull();
    });

    it('should return null when pair is unknown (pair validator handles it)', () => {
      expect(validateOrderPrice('GBPUSD', 'buy', 'limit', 1.0)).toBeNull();
    });
  });

  describe('market orders', () => {
    it('should return null for market buy (no price rule)', () => {
      expect(validateOrderPrice('EURUSD', 'buy', 'market', 999999)).toBeNull();
    });

    it('should return null for market sell (no price rule)', () => {
      expect(validateOrderPrice('EURUSD', 'sell', 'market', 0.001)).toBeNull();
    });
  });

  describe('limit orders', () => {
    it('should return null for limit buy with price below market', () => {
      expect(validateOrderPrice('EURUSD', 'buy', 'limit', EURUSD - 0.001)).toBeNull();
    });

    it('should return limitBuyTooHigh when limit buy price equals market price', () => {
      expect(validateOrderPrice('EURUSD', 'buy', 'limit', EURUSD)).toEqual(
        jasmine.objectContaining({ limitBuyTooHigh: jasmine.anything() })
      );
    });

    it('should return limitBuyTooHigh when limit buy price is above market price', () => {
      expect(validateOrderPrice('EURUSD', 'buy', 'limit', EURUSD + 0.001)).toEqual(
        jasmine.objectContaining({ limitBuyTooHigh: jasmine.anything() })
      );
    });

    it('should include the marketPrice in the limitBuyTooHigh error', () => {
      const result = validateOrderPrice('EURUSD', 'buy', 'limit', EURUSD + 0.001);
      expect(result?.['limitBuyTooHigh']?.marketPrice).toBe(EURUSD);
    });

    it('should return null for limit sell with price above market', () => {
      expect(validateOrderPrice('EURUSD', 'sell', 'limit', EURUSD + 0.001)).toBeNull();
    });

    it('should return limitSellTooLow when limit sell price equals market price', () => {
      expect(validateOrderPrice('EURUSD', 'sell', 'limit', EURUSD)).toEqual(
        jasmine.objectContaining({ limitSellTooLow: jasmine.anything() })
      );
    });

    it('should return limitSellTooLow when limit sell price is below market price', () => {
      expect(validateOrderPrice('EURUSD', 'sell', 'limit', EURUSD - 0.001)).toEqual(
        jasmine.objectContaining({ limitSellTooLow: jasmine.anything() })
      );
    });

    it('should work correctly with BTCUSD prices', () => {
      expect(validateOrderPrice('BTCUSD', 'buy', 'limit', BTCUSD - 1)).toBeNull();
      expect(validateOrderPrice('BTCUSD', 'buy', 'limit', BTCUSD + 1)).toEqual(
        jasmine.objectContaining({ limitBuyTooHigh: jasmine.anything() })
      );
    });
  });

  describe('stop orders', () => {
    it('should return null for stop buy with price above market', () => {
      expect(validateOrderPrice('EURUSD', 'buy', 'stop', EURUSD + 0.001)).toBeNull();
    });

    it('should return stopBuyTooLow when stop buy price equals market price', () => {
      expect(validateOrderPrice('EURUSD', 'buy', 'stop', EURUSD)).toEqual(
        jasmine.objectContaining({ stopBuyTooLow: jasmine.anything() })
      );
    });

    it('should return stopBuyTooLow when stop buy price is below market price', () => {
      expect(validateOrderPrice('EURUSD', 'buy', 'stop', EURUSD - 0.001)).toEqual(
        jasmine.objectContaining({ stopBuyTooLow: jasmine.anything() })
      );
    });

    it('should return null for stop sell with price below market', () => {
      expect(validateOrderPrice('EURUSD', 'sell', 'stop', EURUSD - 0.001)).toBeNull();
    });

    it('should return stopSellTooHigh when stop sell price equals market price', () => {
      expect(validateOrderPrice('EURUSD', 'sell', 'stop', EURUSD)).toEqual(
        jasmine.objectContaining({ stopSellTooHigh: jasmine.anything() })
      );
    });

    it('should return stopSellTooHigh when stop sell price is above market price', () => {
      expect(validateOrderPrice('EURUSD', 'sell', 'stop', EURUSD + 0.001)).toEqual(
        jasmine.objectContaining({ stopSellTooHigh: jasmine.anything() })
      );
    });
  });
});

describe('validPairValidator', () => {
  it('should return null for empty value (required handles it)', () => {
    expect(validPairValidator(new FormControl(''))).toBeNull();
  });

  it('should return null for EURUSD', () => {
    expect(validPairValidator(new FormControl('EURUSD'))).toBeNull();
  });

  it('should return null for BTCUSD', () => {
    expect(validPairValidator(new FormControl('BTCUSD'))).toBeNull();
  });

  it('should return null for ETHUSD', () => {
    expect(validPairValidator(new FormControl('ETHUSD'))).toBeNull();
  });

  it('should return invalidPair for an unknown pair', () => {
    expect(validPairValidator(new FormControl('GBPUSD'))).toEqual({ invalidPair: true });
  });

  it('should return invalidPair when pair uses slash format', () => {
    expect(validPairValidator(new FormControl('EUR/USD'))).toEqual({ invalidPair: true });
  });

  it('should be case-sensitive', () => {
    expect(validPairValidator(new FormControl('eurusd'))).toEqual({ invalidPair: true });
  });
});
