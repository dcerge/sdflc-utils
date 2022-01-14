import dayjs from 'dayjs';
import { ALPHABET } from './../constants';
import {
  doesValueMatchAlphabet,
  isLengthBetween,
  areStringsEqual,
  replaceAt,
  insertAt,
  randomString,
  formatString,
} from '../index';

describe('Strings tests', () => {
  test('Strings: doesValueMatchAlphabet', () => {
    expect(doesValueMatchAlphabet('password', ALPHABET)).toEqual(true);
    expect(doesValueMatchAlphabet('password', '0123456789')).toEqual(false);
  });

  test('Strings: isLengthBetween', () => {
    expect(isLengthBetween('password', 1, 15)).toEqual(true);
    expect(isLengthBetween('password', 10, 15)).toEqual(false);
    expect(isLengthBetween('password', 1, 5)).toEqual(false);
  });

  test('Strings: areStringsEqual', () => {
    expect(areStringsEqual('password', 'PASSWORD')).toEqual(true);
    expect(areStringsEqual('password', 'PASSWORD1')).toEqual(false);
  });

  test('Strings: replaceAt', () => {
    expect(replaceAt('password', 4, '*****')).toEqual('pass*****');
    expect(replaceAt('password', 10, '**')).toEqual('password');
  });

  test('Strings: insertAt', () => {
    expect(insertAt('password', 4, '****')).toEqual('pass****word');
    expect(insertAt('password', 10, '**')).toEqual('password');
  });

  test('Strings: randomString', () => {
    const str = randomString(16, 'ABCDEF0123456789');
    expect(str).toHaveLength(16);
  });

  test('Strings: formatString with default opt', () => {
    const str = 'Hello {{name}}! Today is {{YYYY-MM-DD}}. Missing {{var}}';
    const obj = { name: 'John', 'YYYY-MM-DD': dayjs('2022-01-01').format('YYYY-MM-DD') };
    const dst = 'Hello John! Today is 2022-01-01. Missing {{var}}';

    expect(formatString(str, obj)).toEqual(dst);
  });

  test('Strings: formatString with wrappers {}', () => {
    const str = 'Hello {name}! Today is {YYYY-MM-DD}. Missing {var}';
    const obj = { name: 'John', 'YYYY-MM-DD': dayjs('2022-01-01').format('YYYY-MM-DD') };
    const dst = 'Hello John! Today is 2022-01-01. Missing {var}';

    expect(formatString(str, obj, { leftWrapper: '{', rightWrapper: '}' })).toEqual(dst);
  });

  test('Strings: formatString with empty wrappers', () => {
    const str = 'Hello {name}! Today is {YYYY-MM-DD}. Missing {var}';
    const obj = { '{name}': 'John', '{YYYY-MM-DD}': dayjs('2022-01-01').format('YYYY-MM-DD') };
    const dst = 'Hello John! Today is 2022-01-01. Missing {var}';

    expect(formatString(str, obj, { leftWrapper: '', rightWrapper: '' })).toEqual(dst);
  });
});
