import { StrOrderHelpers } from '..';

describe('StrOrderHelpers tests', () => {
  const order = new StrOrderHelpers({ start: '100', step: '5' });

  beforeEach(() => {
    order.reset();
  });

  test('add', () => {
    expect(order.add('1000', 'bb')).toEqual('10bb');
  });

  test('substract', () => {
    expect(order.substract('10cc', 'cc')).toEqual('1000');
  });

  test('addValue', () => {
    expect(order.addValue('aa')).toEqual('1aa');
  });

  test('valueBetween', () => {
    expect(order.valueBetween('aaa', 'ccc')).toEqual('bbb');
    expect(order.valueBetween('100', '104')).toEqual('102');
    expect(order.valueBetween('104', '100')).toEqual('102');
    expect(order.valueBetween('100', '101')).toEqual(null);
  });

  test('substractValue', () => {
    expect(order.substractValue('a')).toEqual('zq');
  });

  test('Increase', () => {
    expect(order.increase()).toEqual('105');
    expect(order.increase()).toEqual('10a');
  });

  test('Decrease', () => {
    expect(order.decrease()).toEqual('zv');
    expect(order.decrease()).toEqual('zq');
  });
});
