// ./src/tests/strOrderHelpers.test.ts

import { StrOrderHelpers } from '../';

// =============================================================================
// Constructor / defaults
// =============================================================================
describe('StrOrderHelpers — constructor', () => {
  it('defaults start to "0", step to "1", base to 36', () => {
    const h = new StrOrderHelpers();
    expect(h.current()).toBe('0');
  });

  it('accepts custom start, step, and base', () => {
    const h = new StrOrderHelpers({ start: 'a', step: '2', base: 36 });
    expect(h.current()).toBe('a');
  });

  it('defaults to base 36 for null base', () => {
    const h = new StrOrderHelpers({ base: null as any });
    expect(h.add('z', '1')).toBe('10'); // z(35) + 1 = 36 = "10" in base36
  });

  it('defaults to base 36 for NaN base', () => {
    const h = new StrOrderHelpers({ base: NaN });
    expect(h.add('z', '1')).toBe('10');
  });

  it('works with no args', () => {
    expect(() => new StrOrderHelpers()).not.toThrow();
  });
});

// =============================================================================
// Shared instance for complex/stateful tests
// start='100' (1296 in base36), step='5'
// =============================================================================
describe('StrOrderHelpers — complex cases (start="100", step="5")', () => {
  let order: StrOrderHelpers;

  beforeEach(() => {
    order = new StrOrderHelpers({ start: '100', step: '5' });
  });

  test('add: 1000 + bb = 10bb', () => {
    // 46656 + 407 = 47063 = '10bb' in base36
    expect(order.add('1000', 'bb')).toBe('10bb');
  });

  test('subtract: 10cc - cc = 1000', () => {
    // 47100 - 444 = 46656 = '1000' in base36
    expect(order.subtract('10cc', 'cc')).toBe('1000');
  });

  test('substract (deprecated alias): 10cc - cc = 1000', () => {
    expect(order.substract('10cc', 'cc')).toBe('1000');
  });

  test('addValue: current(100) + aa = 1aa', () => {
    // 1296 + 370 = 1666 = '1aa' in base36
    expect(order.addValue('aa')).toBe('1aa');
    expect(order.current()).toBe('1aa');
  });

  test('subtractValue: current(100) - a = zq', () => {
    // 1296 - 10 = 1286 = 'zq' in base36
    expect(order.subtractValue('a')).toBe('zq');
    expect(order.current()).toBe('zq');
  });

  test('substractValue (deprecated alias): current(100) - a = zq', () => {
    expect(order.substractValue('a')).toBe('zq');
  });

  test('increase: 100 → 105 → 10a', () => {
    expect(order.increase()).toBe('105'); // 1296+5=1301='105'
    expect(order.increase()).toBe('10a'); // 1301+5=1306='10a'
  });

  test('decrease: after two increases (at 10a), 10a → 105 → 100', () => {
    order.increase(); // 105
    order.increase(); // 10a
    expect(order.decrease()).toBe('105'); // 1306-5=1301
    expect(order.decrease()).toBe('100'); // 1301-5=1296
  });

  test('valueBetween: aaa and ccc = bbb', () => {
    // aaa=13330, ccc=15996, mid=14663='bbb'
    expect(order.valueBetween('aaa', 'ccc')).toBe('bbb');
  });

  test('valueBetween: 100 and 104 = 102', () => {
    // 1296 and 1300, mid=1298='102'
    expect(order.valueBetween('100', '104')).toBe('102');
  });

  test('valueBetween: argument order is commutative', () => {
    expect(order.valueBetween('104', '100')).toBe('102');
  });

  test('valueBetween: adjacent values return null', () => {
    // 1296 and 1297 — no integer between them
    expect(order.valueBetween('100', '101')).toBeNull();
  });
});

// =============================================================================
// current / reset
// =============================================================================
describe('StrOrderHelpers — current / reset', () => {
  it('current returns the current counter value', () => {
    const h = new StrOrderHelpers({ start: '5' });
    expect(h.current()).toBe('5');
  });

  it('reset restores the counter to the start value', () => {
    const h = new StrOrderHelpers({ start: '5' });
    h.increase();
    h.increase();
    h.reset();
    expect(h.current()).toBe('5');
  });
});

// =============================================================================
// add
// =============================================================================
describe('StrOrderHelpers — add', () => {
  it('adds two base-36 values', () => {
    const h = new StrOrderHelpers();
    expect(h.add('a', '5')).toBe('f'); // 10+5=15
    expect(h.add('z', '1')).toBe('10'); // 35+1=36
  });

  it('adds in base 10', () => {
    const h = new StrOrderHelpers({ base: 10 });
    expect(h.add('7', '8')).toBe('15');
  });

  it('returns "0" for invalid valueA', () => {
    const h = new StrOrderHelpers();
    expect(h.add('', '1')).toBe('0');
  });

  it('returns "0" for invalid valueB', () => {
    const h = new StrOrderHelpers();
    expect(h.add('1', '')).toBe('0');
  });
});

// =============================================================================
// subtract
// =============================================================================
describe('StrOrderHelpers — subtract', () => {
  it('subtracts two base-36 values', () => {
    const h = new StrOrderHelpers();
    expect(h.subtract('f', '5')).toBe('a'); // 15-5=10
    expect(h.subtract('10', '1')).toBe('z'); // 36-1=35
  });

  it('subtracts in base 10', () => {
    const h = new StrOrderHelpers({ base: 10 });
    expect(h.subtract('15', '8')).toBe('7');
  });

  it('handles negative result', () => {
    const h = new StrOrderHelpers();
    expect(h.subtract('1', 'a')).toBe('-9'); // 1-10=-9
  });

  it('returns "0" for invalid input', () => {
    const h = new StrOrderHelpers();
    expect(h.subtract('', '1')).toBe('0');
  });
});

// =============================================================================
// valueBetween
// =============================================================================
describe('StrOrderHelpers — valueBetween', () => {
  it('finds the midpoint between two values', () => {
    const h = new StrOrderHelpers();
    // 0 and 20 ('k'), mid = 10 = 'a'
    expect(h.valueBetween('0', 'k')).toBe('a');
  });

  it('is commutative — argument order does not matter', () => {
    const h = new StrOrderHelpers();
    expect(h.valueBetween('0', 'k')).toBe(h.valueBetween('k', '0'));
  });

  it('returns null for equal values', () => {
    const h = new StrOrderHelpers();
    expect(h.valueBetween('5', '5')).toBeNull();
  });

  it('returns null for adjacent values', () => {
    const h = new StrOrderHelpers();
    expect(h.valueBetween('1', '2')).toBeNull();
  });

  it('returns null for invalid input', () => {
    const h = new StrOrderHelpers();
    expect(h.valueBetween('', '5')).toBeNull();
    expect(h.valueBetween('5', '')).toBeNull();
  });

  it('is not fooled by lexicographic ordering: z(35) < aa(370)', () => {
    // lexicographically 'z' > 'aa' but numerically z=35 < aa=370
    const h = new StrOrderHelpers();
    const mid = h.valueBetween('z', 'aa');
    const midNum = parseInt(mid!, 36);
    expect(midNum).toBeGreaterThan(35); // > z
    expect(midNum).toBeLessThan(370); // < aa
  });

  it('works in base 10', () => {
    const h = new StrOrderHelpers({ base: 10 });
    expect(h.valueBetween('0', '10')).toBe('5');
    expect(h.valueBetween('0', '11')).toBe('5');
  });
});
