import { ALPHABET } from './../constants';
import {
  doesValueMatchAlphabet,
  isLengthBetween,
  areStringsEqual,
  replaceAt,
  insertAt
} from '../index';

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
