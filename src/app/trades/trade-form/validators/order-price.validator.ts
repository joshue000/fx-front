import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { MARKET_PRICES, VALID_PAIRS } from '../../../core/constants/market-prices.constant';
import { OrderSide, OrderType } from '../../../core/models/trade-order.model';

export const PRICE_CROSS_FIELD_ERROR_KEYS: string[] = [
  'limitBuyTooHigh',
  'limitSellTooLow',
  'stopBuyTooLow',
  'stopSellTooHigh',
];

/**
 * Pure function that evaluates the cross-field price rule.
 * Returns a ValidationErrors object if the rule is violated, null otherwise.
 * Does NOT validate that the pair exists — that is handled by validPairValidator.
 */
export function validateOrderPrice(
  pair: string | null,
  side: string | null,
  type: string | null,
  price: number | null,
): ValidationErrors | null {
  if (!pair || !side || !type || price == null) return null;
  if (!VALID_PAIRS.includes(pair)) return null;
  if (type === OrderType.market) return null;

  const marketPrice = MARKET_PRICES[pair];

  if (type === OrderType.limit) {
    if (side === OrderSide.buy && price >= marketPrice) {
      return { limitBuyTooHigh: { marketPrice } };
    }
    if (side === OrderSide.sell && price <= marketPrice) {
      return { limitSellTooLow: { marketPrice } };
    }
  }

  if (type === OrderType.stop) {
    if (side === OrderSide.buy && price <= marketPrice) {
      return { stopBuyTooLow: { marketPrice } };
    }
    if (side === OrderSide.sell && price >= marketPrice) {
      return { stopSellTooHigh: { marketPrice } };
    }
  }

  return null;
}

/**
 * Control-level validator for the pair field.
 * Allows empty values (required is handled separately).
 */
export function validPairValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  return VALID_PAIRS.includes(value) ? null : { invalidPair: true };
}

/**
 * Group-level validator that sets cross-field price errors directly on the
 * price control. Errors are applied whenever price has a value, making
 * validation reactive — errors reflect the current form state immediately.
 * Display-side gating (whether to show the error in the UI) is handled
 * by the component's showPriceCrossFieldError getter.
 */
export const orderPriceGroupValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pair = group.get('pair')?.value as string | null;
  const side = group.get('side')?.value as string | null;
  const type = group.get('type')?.value as string | null;
  const priceControl = group.get('price');

  if (!priceControl) return null;

  const crossFieldError = validateOrderPrice(pair, side, type, priceControl.value as number | null);

  // Merge with existing individual-validator errors (e.g. required, min)
  // to avoid overwriting them. Remove stale cross-field keys first.
  const currentErrors = { ...(priceControl.errors ?? {}) };
  PRICE_CROSS_FIELD_ERROR_KEYS.forEach(key => delete currentErrors[key]);

  const merged = crossFieldError
    ? { ...currentErrors, ...crossFieldError }
    : Object.keys(currentErrors).length
      ? currentErrors
      : null;

  priceControl.setErrors(merged, { emitEvent: false });

  // Errors are set on the child control; nothing to report on the group itself.
  return null;
};
