# @sdflc/utils

This is a set of utilities for arrays, numbers, strings, etc and it is used in projects within @sdflc ecosystem to avoid using 3rd party libraries as much as possible.

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

Returns a new array which has each string upper cased.

```js
const arr = ['aaa', 'bbb'];
const res = arrToUpperCase(arr);
// res = ['AAA', 'BBB']
```

## arrToLowerCase(arr: string[])

Returns a new array which has each string lower cased.

```js
const arr = ['AAA', 'BBB'];
const res = arrToUpperCase(arr);
// res = ['aaa', 'bbb']
```

## arrToChunks(arr: any[], chunkSize: number)

Splits an array into sub-arrays with 'chunkSize' elements in each array

```js
const src = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const res1 = arrToChunks(src, 3);
// res1 = [[1,2,3], [4,5,6], [7,8,9], [0]]
const res2 = arrToChunks(src, 5);
// res2 = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 0]];
const res3 = arrToChunks(src, 0);
// res3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
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

# Numbers

## roundNumberValue(value: number, decimals?: number)

Simply applies `.toFixed(decimals)` to a provided value and returns it as a number

```js
roundNumberValue(34.567); // 34.57
roundNumberValue(34.5674, 3); // 34.567
```

## roundNumberValues(obj: any, decimals?: number)

Accepts a number, an array of numbers or an array of objects and rounds all found numbers to provided number of decimals (2 decimals is default)

```js
const values = [34.567, 2.456, 7.233];
const result = roundNumberValues(values);
// => result = [34.57, 2.46, 7.23];
const inValues = [
  { a: 34.567, b: 'a' },
  { a: 2.456, b: 'a' },
  { a: 7.233, b: 'a' },
];
const outValues = roundNumberValues(inValues);
// => outValues = [
//   { a: 34.57, b: 'a' },
//   { a: 2.46, b: 'a' },
//   { a: 7.23, b: 'a' },
// ]
```

# Strings

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

## randomString(length: number, alphabet?: string)

Generates a random string of `length` charatecer consisting of letters from the `alphabet`.

```js
randomString(5, 'ABC0123456789'); // => possible result is 'D09A3'
```

## formatString(str: string, obj: any, opt?: FormatStringOptInterface)

Replaces variables by their values in provided string template

```js
const str = 'Hello {name}! Today is {YYYY-MM-DD}. Missing {var}';
const obj = { name: 'John', 'YYYY-MM-DD': dayjs('2022-01-01').format('YYYY-MM-DD') };

const res = formatString(str, obj, { leftWrapper: '{', rigthWrapper: '}' });
// res => 'Hello John! Today is 2022-01-01. Missing {var}'
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

## compactObject(obj: any): any

Takes and object or an array and returns a new object without properties that have values null or undefined.

```js
const src = {
  firstName: 'John',
  lastName: '',
  birthday: null,
  obj: {
    propA: 'A',
    propB: null,
  },
};

const dst = compactObject(src);

// => dst = {
//   firstName: 'John',
//   lastName: '',
//   obj: {
//     propA: 'A',
//   },
// };
```

# Keys

## camelKeys(obj: any)

Uses lodash's `mapKeys` and `camelCase` to convert object's property names to camel case. If the `obj` is an array then it goes all over the array items.

```js
const dbItems = [
  { first_name: 'John', last_name: 'Smith' },
  { first_name: 'Tom', last_name: '' },
];
const items = camelKeys(dbItems);
// => items = [{ firstName: 'John', lastName: 'Smith' }, { firstName: 'Tom', lastName: '' }];
```

## buildKey(keys: any)

Normalizes `keys` to some standard representation so it could be used is a key in key-value storage. It usues `slug` function inside.

```js
buildKey('aBc'); // => 'abc'
buildKey(['aBc', '123']); // => 'abc-123'
buildKey('One Two Three!'); // => 'one-two-three'
```

## buildKeys(keys: any[])

Normalizes input array `keys` to some standard representation so it could be used is a key in key-value storage. It just goes over all items and calls `buildKey` for each one.

```js
buildKey(['PassWORD', 'ABC']); // => ['password', 'abc']
buildKey(['PassWORD', ['ABC', '123']]); // => ['password', 'abc-123']
```

## isIdEmpty(value: string | number | undefined | null)

Checks if passed ID value is empty. An ID value is empty when it is null, undefined, equals to `0`, `'0'` or `'00000000-0000-0000-0000-000000000000'`

```js
isIdEmpty('0'); // => true
isIdEmpty(0); // => true
isIdEmpty('10'); // => false
```

## slug(str: string)

Converts the source string `str` to a slug:

```js
slug('some/path/to/page.html'); // => 'some-path-to-page-html'
slug('some!value@email.com'); // => 'some-value-email-com'
slug('some   value to slugify!!!'); // => 'some-value-to-slugify'
```

## pascalCase(name: string): string

Converts string to PascalCase.

```js
pascalCase('pascal_case'); // => 'PascalCase'
pascalCase('pascal case'); // => 'PascalCase'
pascalCase('pascalCase'); // => 'PascalCase'
```

## pascalCases(args: any): any

Takes an array of objects or an object and converts objects property names to PascalCase. Uses lodash's function `camelCase` under the hood.

```js
const src = {
  snake_case: 'snake_case',
  camelCase: 'camelCase',
};

const dst = pascalCases({ src });

// => dst = {
//   SnakeCase: 'snake_case',
//   CamelCase: 'camelCase',
// }
```

# Transformers

## buildHierarchy(arr: any[], idField: string, parentIdField: string, nameForChildren: string)

Builds hierarchy out of provided array. See example below

```js
const arr = [
  {
    id: '1',
    value: 'root',
    parentId: null,
  },
  {
    id: '4',
    value: 'child 2.1',
    parentId: '2',
  },
  {
    id: '2',
    value: 'child 1.1',
    parentId: '1',
  },
  {
    id: '3',
    value: 'child 1.2',
    parentId: '1',
  },
  {
    id: '5',
    value: 'child 3.1',
    parentId: '3',
  },
  {
    id: '6',
    value: 'orphan',
    parentId: '9',
  },
];

const result = buildHierarchy(src, 'id', 'parentId', 'children');

// result = {
//   tree: [
//     {
//       id: '1',
//       value: 'root',
//       parentId: null,
//       children: [
//         {
//           id: '2',
//           value: 'child 1.1',
//           parentId: '1',
//           children: [
//             {
//               id: '4',
//               value: 'child 2.1',
//               parentId: '2',
//               children: [],
//             },
//           ],
//         },
//         {
//           id: '3',
//           value: 'child 1.2',
//           parentId: '1',
//           children: [
//             {
//               id: '5',
//               value: 'child 3.1',
//               parentId: '3',
//               children: [],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   orphans: [
//     {
//       id: '6',
//       value: 'orphan',
//       parentId: '9',
//       children: [],
//     },
//   ],
// };
```

## mapArrayBy(arr: any[], mapBy: any, opt?: MapArrayByOptionsInterface)

Maps array to an object by one or array of fields. See an example below

```js
const arr = [{ a: 'AAA', b: 'BBB'}, { a: 'CCC', b: 'DDD' }]
const map1 = mapArrayBy(arr, 'a');
// => map1 =
//  {
//    AAA: { a: 'AAA', b: 'BBB'},
//    CCC: { a: 'CCC', b: 'DDD' }
//  }

const map2 = mapArrayBy(arr, ['a', 'b']); =>
// => map2 = {
//    a: { AAA: { a: 'AAA', b: 'BBB'}, CCC: { a: 'CCC', b: 'DDD' } },
//    b: { BBB: { a: 'AAA', b: 'BBB'}, DDD: { a: 'CCC', b: 'DDD' } }
//  }
```

## flattenHierarchy(flattenHierarchy = (arr: any[], nameForChildren: string, opt?: FlattenHierarchyOptions))

Flattens an array objects that have children.

```js
const arr = [
  {
    id: '1',
    value: 'root',
    parentId: null,
    children: [
      {
        id: '2',
        value: 'child 1.1',
        parentId: '1',
        children: [
          {
            id: '4',
            value: 'child 2.1',
            parentId: '2',
            children: [],
          },
        ],
      },
      {
        id: '3',
        value: 'child 1.2',
        parentId: '1',
        children: [
          {
            id: '5',
            value: 'child 3.1',
            parentId: '3',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: '6',
    value: 'child 3',
    parentId: null,
    children: [],
  },
];

const dst = flattenHierarchy(src, 'children');

// => dst = [
//   {
//     id: '1',
//     value: 'root',
//     parentId: null,
//     children: [...]
//   },
//   {
//     id: '2',
//     value: 'child 1.1',
//     parentId: '1',
//     children: [...],
//   },
//   {
//     id: '4',
//     value: 'child 2.1',
//     parentId: '2',
//     children: [],
//   },
//   {
//     id: '3',
//     value: 'child 1.2',
//     parentId: '1',
//     children: [...],
//   },
//   {
//     id: '5',
//     value: 'child 3.1',
//     parentId: '3',
//     children: [],
//   },
//   {
//     id: '6',
//     value: 'child 3',
//     parentId: null,
//     children: [],
//   },
// ];
```

## getLowestLevelItems = (arr: any[], idField: string, parentIdField: string, nameForChildren: string, setRoot?: boolean)

Gets a flat array that represents hierarchical data (ie, each element has `id` and `parendId` props), then it builds hierarchy with this array and finally it returns only the lowest in the hierarchy items.

```js
const src = [
  {
    id: '1',
    value: 'root',
    parentId: null,
  },
  {
    id: '4',
    value: 'child 2.1',
    parentId: '2',
  },
  {
    id: '2',
    value: 'child 1.1',
    parentId: '1',
  },
  {
    id: '3',
    value: 'child 1.2',
    parentId: '1',
  },
  {
    id: '5',
    value: 'child 3.1',
    parentId: '3',
  },
  {
    id: '6',
    value: 'orphan',
    parentId: '9',
  },
];

const dst = getLowestLevelItems(src, 'id', 'parentId', 'children', true);

// => dst = [
//   {
//     id: '4',
//     value: 'child 2.1',
//     parentId: '2',
//     children: [],
//     rootId: '1',
//   },
//   {
//     id: '5',
//     value: 'child 3.1',
//     parentId: '3',
//     children: [],
//     rootId: '1',
//   },
// ];
```

# Date Helpers

## createStartPeriod(args: any)

In the `args` the the function expects an object with `{ year, month, day }` and returns a string with time `00:00:00.000Z` addded.

```
const start = dataTimeHelpers.createStartPeriod({ year: 2021, month: 5, day: 31 })
// => '2021-05-31T00:00:00.000Z'
```

## createEndPeriod(args: any)

In the `args` the the function expects an object with `{ year, month, day }` and returns a string with time `23:59:59.999Z` addded.

```
const start = dataTimeHelpers.createEndPeriod({ year: 2021, month: 5, day: 31 })
// => '2021-05-31T23:59:59.999Z'
```

## createPeriod(periodType: string, date: string, opt?: any)

Creates a period according period (start and end date/time) type and provided date.

```
const start = dataTimeHelpers.createPeriod(DateTimeHelpers.PeriodTypes.MTD, )
// => {
//      startDate: 2021-05-01T00:00:00.000Z (Date),
//      endDate: 2021-05-30T23:59:59.999Z (Date),
//    }
```

Possible period types:

- MTD - from the start of month till provided date (including),
- QTD - from the start of quarter till provided date (including),
- YTD - from the start of year till provided date (including),
- L1M - Period starts a month from provided date till the date (including),
- L3M - Period starts 3 months from provided date till the date (including),
- L6M - Period starts 6 month till provided date till the date (including),
- L12M - Period starts 12 month till provided date till the date (including),
- MONTH - from first to last day of month for provided date,
- YEAR - from first day of January till December 31 for provided date.

Possible options:

- format - when true returns startDate and endDate as strings. Example, '2021-05-01T00:00:00.000Z'
- utc - use UTC year, month and date

## createRangePeriod(startDate: string, endDate: string, opt?: any)

Creates an object `{ startDate, endDate }` from provided strings. The `opt` parameter has the same structure as for the `createPeriod`

```
const period = dataTimeHelpers.createRangePeriod('2020-05-01T00:00:00.000Z', '2021-05-30T23:59:59.999Z', { utc: true })
// => {
//      startDate: new Date('2020-05-01T00:00:00.000Z'),
//      endDate: new Date('2021-05-30T23:59:59.999Z'),
//    }
```

## createRangePeriodLastYear(startDate: string, endDate: string, opt?: any)

Creates an object `{ startDate, endDate }` from provided strings but for the last year. The `opt` parameter has the same structure as for the `createPeriod`

```
const period = dataTimeHelpers.createRangePeriod('2021-01-01T00:00:00.000Z', '2021-12-31T23:59:59.999Z', { utc: true })
// => {
//      startDate: new Date('2020-01-01T00:00:00.000Z'),
//      endDate: new Date('2020-12-31T23:59:59.999Z'),
//   }
```

## createYearPeriod(year: number, opt?: any)

Creates an object `{ startDate, endDate }` for provided year. The `opt` parameter has the same structure as for the `createPeriod`

```
const period = dataTimeHelpers.createYearPeriod(2021)
// => {
//      startDate: new Date('2021-01-01T00:00:00.000Z'),
//      endDate: new Date('2021-12-31T23:59:59.999Z'),
//    }
```

## getMonthName(monthNo: number)

Returns name for provided month number (0 based).

```
const name = dataTimeHelpers.getMonthName(0);
// => Jan.
```

# StrOrderHelpers

This is a class that helps to work with alphabetic order numbers which are used for sorting rows.

## constructor(opt)

Constructor accepts the `opt` object with the following properties:

- start (string) - start value
- step (string) - step value that will be used to increase/decrease
- base (number) - value base which by default is 36 (English alphabet plus numbers 0-9)

```
const order = new StrOrderHelpers({ start: '100', step: '1' });
```

## reset()

Resets current counter value back to start value

```
const order = new StrOrderHelpers({ start: '100', step: '1' });
order.increase(); // => '101'
order.reset(); // => '100'
```

## current()

Returns current counter value

```
const order = new StrOrderHelpers({ start: '100', step: '1' });
order.increase(); // => '101'
order.increase(); // => '102'
order.current(); // => '101'
```

## addValue(value: string)

Increases current counter by the value passed in as a parameter.

```
const order = new StrOrderHelpers({ start: '100', step: '1' });
order.addValue('a'); // => '10a'
```

## substractValue(value: string)

Decreases current counter by the value passed in as a parameter.

```
const order = new StrOrderHelpers({ start: '10a', step: '1' });
order.desubstractValuecreaseValue('a'); // => '100'
```

## increase()

Increases current counter by the step value passed to the constructor.

```
const order = new StrOrderHelpers({ start: '100', step: '5' });
order.increase(); // => '105'
order.increase(); // => '10a'
```

## decrease()

Decreases current counter by the step value passed to the constructor.

```
const order = new StrOrderHelpers({ start: '101', step: '1' });
order.decrease(); // => '100'
```

## add(valueA: string, valueB: string)

Adds valueB to the valueA and returns result

```
const order = new StrOrderHelpers();
order.add('100', 'a'); // => '10a'
```

## substract(valueA: string, valueB: string)

Substracts valueB from the valueA and returns result

```
const order = new StrOrderHelpers();
order.substract('10a', 'a'); // => '100'
```

## valueBetween(valueA: string, valueB: string)

Finds values in the middle between valueA and valueB. If nothing found returns null value

```
const order = new StrOrderHelpers();
order.valueBetween('aaa', 'ccc'); // => 'bbb'
```

# URL Params

## buildURLSearchParams(data: any)

Creates an object of type URLSearchParams and adds properties of received object `data` to its params. The `data` can be an array or a complex object.

```js
const src = {
  fieldA: 'A',
  fieldB: [
    {
      arrA: '1',
      arrB: '2',
      arrC: {
        subA: '100',
      },
    },
  ],
};

const params = buildURLSearchParams(src);

const str = params.toString();

// => str = 'fieldA=A&fieldB%5B0%5D.arrA=1&fieldB%5B0%5D.arrB=2&fieldB%5B0%5D.arrC.subA=100'
```

# Geo Helpers

## calcDistance(args: CalcDistanceArgs)

Calculates distance between two coordinates with latitude and longitude. The result in kilometers.

```js
const position1 = {
  latitude: 50.947718,
  longitude: -114.123893,
};
const position2 = {
  latitude: 50.947745,
  longitude: -115.121994,
};

const distance = calcDistance({ position1, position2 });
// => distance = 69.9224684913042
```
