// ./src/strOrderHelpers.ts

export interface StrOrderHelpersOptions {
  /** Starting counter value in the given base. Defaults to `'0'`. */
  start?: string;
  /** Step size used by `increase()` and `decrease()`. Defaults to `'1'`. */
  step?: string;
  /** Numeric base for parsing and formatting values. Defaults to `36`. */
  base?: number;
}

class StrOrderHelpers {
  private start: string;
  private step: string;
  private orderNo: string;
  private base: number;

  /**
   * @param opt - Initial options: `start`, `step`, and `base` (default 36).
   */
  constructor(opt?: StrOrderHelpersOptions) {
    this.start = opt?.start ?? '0';
    this.step = opt?.step ?? '1';
    this.base = opt?.base == null || isNaN(Number(opt.base)) ? 36 : Number(opt.base);
    this.orderNo = this.start;
  }

  // ---------------------------------------------------------------------------
  // Counter API
  // ---------------------------------------------------------------------------

  /**
   * Returns the current counter value.
   */
  current(): string {
    return this.orderNo;
  }

  /**
   * Resets the counter to the start value.
   */
  reset(): void {
    this.orderNo = this.start;
  }

  /**
   * Adds `value` to the counter and returns the new counter value.
   *
   * @param value - Value to add (in the current base).
   */
  addValue(value: string): string {
    this.orderNo = this.add(this.orderNo, value);
    return this.orderNo;
  }

  /**
   * Subtracts `value` from the counter and returns the new counter value.
   *
   * @param value - Value to subtract (in the current base).
   */
  subtractValue(value: string): string {
    this.orderNo = this.subtract(this.orderNo, value);
    return this.orderNo;
  }

  /**
   * @deprecated Renamed to `subtractValue`. Will be removed in a future major version.
   */
  substractValue(value: string): string {
    return this.subtractValue(value);
  }

  /**
   * Increases the counter by `step` and returns the new value.
   */
  increase(): string {
    return this.addValue(this.step);
  }

  /**
   * Decreases the counter by `step` and returns the new value.
   */
  decrease(): string {
    return this.subtractValue(this.step);
  }

  // ---------------------------------------------------------------------------
  // Arithmetic helpers
  // ---------------------------------------------------------------------------

  /**
   * Adds `valueB` to `valueA` and returns the result in the current base.
   * Returns `'0'` if either value is not a valid number in the current base.
   *
   * @param valueA - Augend (in the current base).
   * @param valueB - Addend (in the current base).
   */
  add(valueA: string, valueB: string): string {
    const a = parseInt(valueA, this.base);
    const b = parseInt(valueB, this.base);
    if (isNaN(a) || isNaN(b)) return '0';
    return (a + b).toString(this.base);
  }

  /**
   * Subtracts `valueB` from `valueA` and returns the result in the current base.
   * Returns `'0'` if either value is not a valid number in the current base.
   *
   * @param valueA - Minuend (in the current base).
   * @param valueB - Subtrahend (in the current base).
   */
  subtract(valueA: string, valueB: string): string {
    const a = parseInt(valueA, this.base);
    const b = parseInt(valueB, this.base);
    if (isNaN(a) || isNaN(b)) return '0';
    return (a - b).toString(this.base);
  }

  /**
   * @deprecated Renamed to `subtract`. Will be removed in a future major version.
   */
  substract(valueA: string, valueB: string): string {
    return this.subtract(valueA, valueB);
  }

  /**
   * Finds the value halfway between `valueA` and `valueB`.
   * Returns `null` if no distinct midpoint exists (i.e. the two values are
   * adjacent or equal).
   *
   * @param valueA - First boundary value (in the current base).
   * @param valueB - Second boundary value (in the current base).
   */
  valueBetween(valueA: string, valueB: string): string | null {
    const a = parseInt(valueA, this.base);
    const b = parseInt(valueB, this.base);

    if (isNaN(a) || isNaN(b)) return null;

    const minValue = Math.min(a, b);
    const maxValue = Math.max(a, b);

    const mid = minValue + Math.floor((maxValue - minValue) / 2);
    const midStr = mid.toString(this.base);

    return mid !== minValue ? midStr : null;
  }
}

export { StrOrderHelpers };
