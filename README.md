# @sdflc/utils

This is a set of utilities for arrays, strings, etc used in projects within @sdflc ecosystem to avoid using 3rd party libraries as much as possible.

# Arrays

## arrayToObject(arr: any[], nameKey: string, valueKey: string)

Takes an array of objects and returns a new object that has properties which names are taken from array object property `nameKey` and with values that are taken from array object property `valueKey`

```js
const arr = [
  { name: 'status', value: 'active' },
  { name: 'name', value: 'Some name' },
];
const obj = arrayToObject(arr, 'name', 'value');
// obj => { status: 'active', name: 'Some name' }
```

## arrToUpperCase(arr: string[])

Returns a new array which has each tring upper cased.

```js
const arr = ['aaa', 'bbb'];
const res = arrToUpperCase(arr);
// res = ['AAA', 'BBB']
```

## arrToLowerCase(arr: string[])

Returns a new array which has each tring lower cased.

```js
const arr = ['AAA', 'BBB'];
const res = arrToUpperCase(arr);
// res = ['aaa', 'bbb']
```

# Converters

## converStringToValue(value: any, type: string)

Converts a string to the value

```js
converStringToValue('123', VALUE_TYPES.INTEGER); // => 123
converStringToValue('123asd', VALUE_TYPES.INTEGER); // => NaN
converStringToValue('123asd', VALUE_TYPES.STRING); // => 123asd
converStringToValue('12.3', VALUE_TYPES.FLOAT); // => 12.3
converStringToValue('true', VALUE_TYPES.BOOLEAN); // => true
converStringToValue('false', VALUE_TYPES.BOOLEAN); // => false
converStringToValue('blah', VALUE_TYPES.BOOLEAN); // => false
```

# Languages

## extractLanguages(str: string)

Expects a string with list of languages taken from HTTP header and returns an array of languages:

```js
const acceptLanguage = 'en-US,en;q=0.9,ru;q=0.8,fr;q=0.7';
const langs = extractLanguages(acceptLanguage); // => ['en-US', 'en', 'ru', 'fr'];
```

# Strigns

## doesValueMatchAlphabet(value: string, alphabet: string)

Returns true if string has characters only from provided alphabet.

```js
const alphabet = 'ABC123456789-';
doesValueMatchAlphabet('AB-123', alphabet); // => true
doesValueMatchAlphabet('AD-123', alphabet); // => false
```

## isLengthBetween(str: string, minLen: number, maxLen: number)

Returns true if a string's length is within `minLen` and `maxLen` values.

```js
isLengthBetween('abcd', 1, 5); // => true
isLengthBetween('abcdef', 1, 5); // => false
```

## areStringsEqual(strLeft: string, strRight: string)

Compares two strings case insenstive

```js
areStringsEqual('ABC', 'abc'); // => true
areStringsEqual('ABC', 'abd'); // => false
```

## replaceAt(str: string, index: number, replacement: string)

Replaces `str` with `replacement` starting from `index` position.

```js
replaceAt('password', 4, '*****'); // => 'pass*****'
replaceAt('password', 10, '*****'); // => 'password'
```

## insertAt(str: string, index: number, insert: string)

Inserts `insert` into `str` starting from `index` position.

```js
insertAt('password', 4, '*****'); // => 'pass*****word'
insertAt('password', 10, '*****'); // => 'password'
```

# Objects

## setNullOnEmptyString(obj: any)

Returns a new object which is copy of `obj` but those properties that have emprty string value have `null` in returned object

```js
setNullOnEmptyString({ firstName: 'John', lastName: '' }); // => { firstName: 'John', lastName: null }
```

## onlyPropsOf(source: any, destinationType: new () => T)

Takes `source` object and leaves only properties from `destinationType`.

```js
class User {
  name: string = '';
  email: string = '';
}

const obj = {
  name: 'John',
  email: 'john@mail.com',
  someProp: 'blah',
};

const result = onlyPropsOf(obj, User);
// => result = {
//   name: 'John',
//   email: 'john@mail.com'
// }
```

# Keys

## camelKeys(obj: any)

Uses lodash's `mapKeys` and `camelCase` to convert object's property names to camel case. IF the `obj` is an array then it goes all over the array items.

```js
const dbItems = [
  { first_name: 'John', last_name: 'Smith' },
  { first_name: 'Tom', last_name: '' },
];
const items = camelKeys(dbItems);
// => items = [{ firstName: 'John', lastName: 'Smith' }, { firstName: 'Tom', lastName: '' }];
```

## buildKey(keys: any)

Normalizes `keys` to some standard representation so it could be used is a key in key-value storage

```js
buildKey('aBc'); // => 'abc'
buildKey(['aBc', '123']); // => 'abc-123'
```

## buildKeys(keys: any[])

Normalizes input array `keys` to some standard representation so it could be used is a key in key-value storage

```js
buildKey(['PassWORD', 'ABC']); // => ['password', 'abc']
buildKey(['PassWORD', ['ABC', '123']]); // => ['password', 'abc-123']
```

## slug(str: string)

Converts the source string `str` to a slug:

```js
slug('some/path/to/page.html'); // => 'some-path-to-page-html'
slug('some!value@email.com'); // => 'some-value-email-com'
slug('some   value to slugify!!!'); // => 'some-value-to-slugify'
```
