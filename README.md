# @sdflc/utils

A collection of TypeScript utility functions for common tasks including address formatting, array manipulation, color helpers, unit conversions, geolocation math, logging, performance measurement, string processing, and more.

---

## Installation

```bash
npm install @sdflc/utils
```

---

## Table of Contents

- [Addresses](#addresses)
- [Arrays](#arrays)
- [Colors](#colors)
- [Constants](#constants)
- [Converters](#converters)
- [Geo](#geo)
- [Languages](#languages)
- [Logger](#logger)
- [MeasureTool](#measuretool)
- [Numbers](#numbers)
- [Objects](#objects)
- [Strings](#strings)
- [String Helpers](#string-helpers)
- [StrOrderHelpers](#strorderhelpers)
- [Transformers](#transformers)
- [URL Params](#url-params)

---

## Addresses

```typescript
import { formatAddressShort, formatAddressFull } from '@sdflc/utils';
```

### `formatAddressShort(address)`

Formats an `AddressData` object into a short display string suitable for place auto-fill. Includes `address1`, `city`, and `region`.

```typescript
formatAddressShort({ address1: '123 Main St', city: 'Calgary', region: 'AB' });
// => '123 Main St, Calgary, AB'

formatAddressShort(null); // => ''
```

### `formatAddressFull(address)`

Formats an `AddressData` object into a full display string. Includes `address1`, `city`, `region`, `postalCode`, and `country`.

```typescript
formatAddressFull({
  address1: '123 Main St',
  city: 'Calgary',
  region: 'AB',
  postalCode: 'T2P 1J9',
  country: 'Canada',
});
// => '123 Main St, Calgary, AB T2P 1J9, Canada'
```

---

## Arrays

```typescript
import { arrayToObject, arrToUpperCase, arrToLowerCase, arrToChunks } from '@sdflc/utils';
```

### `arrayToObject(arr, nameKey, valueKey)`

Converts an array of objects into a plain object using `nameKey` for property names and `valueKey` for values.

```typescript
const arr = [
  { name: 'status', value: 'active' },
  { name: 'role', value: 'admin' },
];
arrayToObject(arr, 'name', 'value');
// => { status: 'active', role: 'admin' }
```

### `arrToUpperCase(arr)`

Uppercases every string in the array. Null/undefined items become `''`.

```typescript
arrToUpperCase(['hello', 'world']); // => ['HELLO', 'WORLD']
```

### `arrToLowerCase(arr)`

Lowercases every string in the array. Null/undefined items become `''`.

```typescript
arrToLowerCase(['HELLO', 'WORLD']); // => ['hello', 'world']
```

### `arrToChunks(arr, chunkSize)`

Splits an array into sequential chunks of `chunkSize`. Returns the original array if `chunkSize` is less than 1 or NaN.

```typescript
arrToChunks([1, 2, 3, 4, 5], 2); // => [[1, 2], [3, 4], [5]]
arrToChunks([1, 2, 3], 0); // => [1, 2, 3]
```

---

## Colors

```typescript
import { getRandomHexColor, getMostContrastingColor } from '@sdflc/utils';
```

### `getRandomHexColor()`

Returns a random hex color string in `#RRGGBB` format, including `#000000` and `#FFFFFF`.

```typescript
getRandomHexColor(); // => '#a3f2c1'
```

### `getMostContrastingColor(hex)`

Returns either `#000000` or `#FFFFFF` — whichever has the higher WCAG contrast ratio against the given background color. Supports `#RGB`, `#RGBA`, `#RRGGBB`, and `#RRGGBBAA` formats. Alpha is preserved in the output if present in the input.

```typescript
getMostContrastingColor('#000000'); // => '#FFFFFF'
getMostContrastingColor('#FFFFFF'); // => '#000000'
getMostContrastingColor('#1a1a2e'); // => '#FFFFFF'
getMostContrastingColor('#000000aa'); // => '#FFFFFFaa'
```

---

## Constants

```typescript
import {
  VALUE_TYPES,
  STATUSES,
  ACCESS_RIGHTS,
  SORT_ORDER,
  DISTANCE_UNITS,
  VOLUME_UNITS,
  CONSUMPTION_UNITS,
} from '@sdflc/utils';
```

### `VALUE_TYPES`

Numeric codes for data types used with `convertStringToValue`.

| Key        | Value |
| ---------- | ----- |
| `NUMBER`   | 100   |
| `INTEGER`  | 101   |
| `FLOAT`    | 102   |
| `DECIMAL`  | 103   |
| `CURRENCY` | 200   |
| `BOOLEAN`  | 300   |
| `STRING`   | 400   |
| `JSON`     | 500   |
| `EMAIL`    | 1001  |
| `PHONE`    | 1002  |
| `URL`      | 1003  |

### `STATUSES`

Standard record status codes.

| Key        | Value |
| ---------- | ----- |
| `TEST`     | 50    |
| `ACTIVE`   | 100   |
| `DRAFT`    | 200   |
| `PENDING`  | 300   |
| `BLOCKED`  | 1000  |
| `DISABLED` | 5000  |
| `REMOVED`  | 10000 |

### `ACCESS_RIGHTS`

Bitmask values for permission checks.

```typescript
// Combine with bitwise OR
const rights = ACCESS_RIGHTS.LIST | ACCESS_RIGHTS.GET; // => 3
```

| Key      | Value |
| -------- | ----- |
| `LIST`   | 1     |
| `GET`    | 2     |
| `CREATE` | 4     |
| `UPDATE` | 8     |
| `REMOVE` | 16    |
| `RUN`    | 32    |

### `DISTANCE_UNITS` / `VOLUME_UNITS` / `CONSUMPTION_UNITS`

Type-safe string constants for unit conversion functions. Always prefer these over raw strings.

```typescript
DISTANCE_UNITS.KM; // => 'km'
DISTANCE_UNITS.MILES; // => 'mi'

VOLUME_UNITS.LITERS; // => 'l'
VOLUME_UNITS.GALLONS_US; // => 'gal-us'
VOLUME_UNITS.GALLONS_UK; // => 'gal-uk'
VOLUME_UNITS.KWH; // => 'kwh'
VOLUME_UNITS.KG; // => 'kg'

CONSUMPTION_UNITS.L_PER_100KM; // => 'l100km'
CONSUMPTION_UNITS.MPG_US; // => 'mpg-us'
CONSUMPTION_UNITS.KWH_PER_100KM; // => 'kwh100km'
// ... and more
```

### Other constants

```typescript
import { UUID_EMPTY, UUID_ZERO, ALPHABET, ALPHABET_CODE, EARTH_RADIUS_M } from '@sdflc/utils';
```

---

## Converters

```typescript
import {
  convertStringToValue,
  stringifyObject,
  parseObject,
  toRadians,
  metersToKm,
  mpsToKmh,
  isElectricUnit,
  isHydrogenUnit,
  isLiquidUnit,
  toMetricDistance,
  fromMetricDistance,
  fromMetricDistanceRounded,
  toMetricVolume,
  fromMetricVolume,
  getConsumptionUnitForFuelType,
  deriveConsumptionUnit,
  calculateConsumption,
} from '@sdflc/utils';
```

### `convertStringToValue(value, valueType)`

Converts a string to a typed value using a `VALUE_TYPES` constant.

```typescript
convertStringToValue('42', VALUE_TYPES.INTEGER); // => 42
convertStringToValue('3.14', VALUE_TYPES.FLOAT); // => 3.14
convertStringToValue('true', VALUE_TYPES.BOOLEAN); // => true
```

### `stringifyObject(config, defaultObj?)`

Safely JSON-stringifies an object. Returns the stringified `defaultObj` on failure.

```typescript
stringifyObject({ a: 1 }); // => '{"a":1}'
stringifyObject(circular, { ok: 1 }); // => '{"ok":1}'
```

### `parseObject(jsonString, defaultObj)`

Safely parses a JSON string into an object shaped like `defaultObj`. Fills in missing keys from defaults and ignores type mismatches.

```typescript
parseObject('{"name":"Alice"}', { name: '', age: 0 });
// => { name: 'Alice', age: 0 }
```

### Unit conversion functions

All return `null` for `null`/`undefined` inputs.

```typescript
toRadians(180); // => 3.14159...
metersToKm(1500); // => 1.5
mpsToKmh(10); // => 36

toMetricDistance(10, DISTANCE_UNITS.MILES); // => 16.093
fromMetricDistance(16.0934, DISTANCE_UNITS.MILES); // => ~10

toMetricVolume(1, VOLUME_UNITS.GALLONS_US); // => 3.785
fromMetricVolume(3.785, VOLUME_UNITS.GALLONS_US); // => ~1
```

### `calculateConsumption(distanceKm, volumeOrEnergy, consumptionUnit)`

Calculates fuel/energy consumption in the specified unit. Supports liquid, electric, and hydrogen units.

```typescript
// 10L over 100km = 10 l/100km
calculateConsumption(100, 10, CONSUMPTION_UNITS.L_PER_100KM); // => 10

// 20kWh over 100km = 20 kWh/100km
calculateConsumption(100, 20, CONSUMPTION_UNITS.KWH_PER_100KM); // => 20
```

---

## Geo

```typescript
import {
  buildCoordinatesStr,
  extractLatitudeLongitude,
  isValidCoordinate,
  calcDistance,
  areCoordinatesNear,
  findNearestLocation,
  haversineDistanceM,
  formatCoordinates,
  createBoundingBox,
  isWithinBoundingBox,
  calculateBearing,
  bearingDelta,
  calculateTotalDistance,
} from '@sdflc/utils';
```

### `buildCoordinatesStr(coords, precision?)`

Formats a `GeoCoords` object as `"lat, lng"` string. Defaults to 5 decimal places.

```typescript
buildCoordinatesStr({ latitude: 51.5074, longitude: -0.1278 });
// => '51.50740, -0.12780'
```

### `extractLatitudeLongitude(coordinatesStr)`

Parses a `"lat,lng"` string into a `GeoCoords` object with numeric values.

```typescript
extractLatitudeLongitude('51.5074,-0.1278');
// => { latitude: 51.5074, longitude: -0.1278 }
```

### `isValidCoordinate(coords)`

Returns `true` if the coordinates are non-null, numeric, and within valid lat/lng ranges.

```typescript
isValidCoordinate({ latitude: 51.5074, longitude: -0.1278 }); // => true
isValidCoordinate({ latitude: 999, longitude: 0 }); // => false
```

### `calcDistance(args)`

Calculates the great-circle distance between two coordinates using the Haversine formula (atan2 variant). Returns distance in **kilometers**.

```typescript
calcDistance({
  position1: { latitude: 51.5074, longitude: -0.1278 },
  position2: { latitude: 48.8566, longitude: 2.3522 },
}); // => ~343 km
```

### `haversineDistanceM(coord1, coord2)`

Same as `calcDistance` but returns distance in **meters**.

```typescript
haversineDistanceM({ latitude: 51.5074, longitude: -0.1278 }, { latitude: 48.8566, longitude: 2.3522 }); // => ~343000 meters
```

### `areCoordinatesNear(coord1, coord2, thresholdM?)`

Returns `true` if two coordinates are within `thresholdM` meters of each other. Default threshold is `DEFAULT_DISTANCE_THRESHOLD_M`.

```typescript
areCoordinatesNear(coordA, coordB, 100); // within 100m?
```

### `findNearestLocation(target, locations, getCoords)`

Finds the nearest item in `locations` to `target`. Returns `{ item, distance }` or `null`.

```typescript
const nearest = findNearestLocation(userCoords, stores, (store) => store.coords);
// => { item: nearestStore, distance: 250.5 }
```

### `createBoundingBox(center, radiusM)`

Creates a `BoundingBox` around a coordinate with the given radius in meters.

```typescript
createBoundingBox({ latitude: 51.5074, longitude: -0.1278 }, 1000);
// => { north: ..., south: ..., east: ..., west: ... }
```

### `isWithinBoundingBox(coords, box)`

Returns `true` if `coords` falls within the bounding box.

### `calculateBearing(p1, p2)`

Returns the initial bearing from `p1` to `p2` in degrees (0–360). Returns `null` for invalid input.

```typescript
calculateBearing({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 10 });
// => ~90 (due East)
```

### `bearingDelta(bearing1, bearing2)`

Returns the absolute angular difference between two bearings (0–180), handling the 0°/360° wraparound.

```typescript
bearingDelta(10, 350); // => 20
```

### `calculateTotalDistance(points)`

Sums great-circle distances between consecutive points. Returns total in **meters**.

```typescript
calculateTotalDistance([london, paris, berlin]); // => total meters
```

---

## Languages

```typescript
import { extractLanguages } from '@sdflc/utils';
```

### `extractLanguages(str)`

Parses an `Accept-Language` HTTP header into an ordered array of language tags.

```typescript
extractLanguages('en-US,en;q=0.9,ru;q=0.8,fr;q=0.7');
// => ['en-US', 'en', 'ru', 'fr']
```

---

## Logger

```typescript
import { Logger } from '@sdflc/utils';
import { LoggerLevels } from '@sdflc/utils/interfaces';
```

A configurable logger with level filtering, optional timestamp, request ID, and module name prefixes.

### Levels (lowest to highest)

`NONE` → `ERROR` → `WARNING` → `LOG` → `DEBUG`

Only messages at or below the current level are emitted.

### Basic usage

```typescript
const logger = new Logger({ level: LoggerLevels.DEBUG });

logger.debug('Fetching user...');
logger.log('User fetched');
logger.warn('Cache miss');
logger.error('Connection failed');
```

### Custom handlers

```typescript
const logger = new Logger({
  level: LoggerLevels.LOG,
  log: (msg) => myLoggingService.info(msg),
  error: (msg) => myLoggingService.error(msg),
});
```

### Prefix options

```typescript
const logger = new Logger({
  level: LoggerLevels.DEBUG,
  timestamp: true, // prepend timestamp to every line
  timestampUtc: true, // use UTC (default: local time)
  requestId: 'req-abc123',
  module: 'UserService',
});

logger.log('User created');
// => [20250325-143022.123Z] [req-abc123] [UserService] User created
```

### `setLevel(newLevel)` / `getLevel()`

```typescript
logger.setLevel(LoggerLevels.ERROR); // suppress everything below ERROR
logger.getLevel(); // => LoggerLevels.ERROR
```

---

## MeasureTool

```typescript
import { MeasureTool } from '@sdflc/utils';
```

A cross-environment performance measurement utility using `performance.now()` (available in Node.js 16+ and all modern browsers).

### Basic measurement

```typescript
const tool = new MeasureTool();
tool.start();

// ... do work ...
const result = tool.stop('total');
console.log(result.durationMs); // milliseconds
```

### Checkpoints

```typescript
tool.start();
await fetchData();
tool.addCheckpoint('fetch');

await processData();
tool.addCheckpoint('process');

const final = tool.stop('done');
console.log(tool.getCheckpoints());
// => [{ name: 'fetch', durationMs: 120, hrtime: [...] }, ...]
```

### `measureExecTime(name, fn)`

Wraps an async function and returns its result along with timing data.

```typescript
const { result, durationMs } = await tool.measureExecTime('myQuery', async () => {
  return await db.query('SELECT ...');
});
```

### `threadBlockTime(name?, fn?)`

Measures event-loop blocking time using `setImmediate`. Node.js only.

```typescript
tool.threadBlockTime('check', ({ name, durationMs }) => {
  console.log(`${name} blocked for ${durationMs}ms`);
});
```

---

## Numbers

```typescript
import { roundNumberValue, roundNumberValues, parseNumericInput } from '@sdflc/utils';
```

### `roundNumberValue(value, decimals?)`

Rounds a number to `decimals` decimal places (default: 2).

```typescript
roundNumberValue(2.34567); // => 2.35
roundNumberValue(2.34567, 3); // => 2.346
roundNumberValue(2.5, 0); // => 3
```

### `roundNumberValues(obj, decimals?)`

Recursively rounds all numeric values in an object or array **in place**. Also returns the mutated value.

```typescript
const data = { price: 9.9999, tax: 1.2345, label: 'item' };
roundNumberValues(data);
// data => { price: 10, tax: 1.23, label: 'item' }

roundNumberValues([1.111, 2.999]); // => [1.11, 3]
```

### `parseNumericInput(value)`

Normalises a value from a numeric input field into `number | null`.

```typescript
parseNumericInput('42'); // => 42
parseNumericInput(''); // => null
parseNumericInput(null); // => null
parseNumericInput('abc'); // => null
parseNumericInput(NaN); // => null
```

---

## Objects

```typescript
import { setNullOnEmptyString, onlyPropsOf, compactObject, cloneDeep } from '@sdflc/utils';
```

### `setNullOnEmptyString(obj)`

Recursively replaces all empty string values (`''`) with `null` in an object or array.

```typescript
setNullOnEmptyString({ firstName: 'John', lastName: '' });
// => { firstName: 'John', lastName: null }

setNullOnEmptyString({ user: { name: '', age: 30 } });
// => { user: { name: null, age: 30 } }

setNullOnEmptyString([{ a: '' }, { a: 'keep' }]);
// => [{ a: null }, { a: 'keep' }]
```

### `onlyPropsOf(source, destinationType)`

Creates an instance of `destinationType` and copies only the properties that exist on that class from `source`.

```typescript
class UserDto {
  id = 0;
  name = '';
}

onlyPropsOf({ id: 1, name: 'Alice', extra: 'ignored' }, UserDto);
// => UserDto { id: 1, name: 'Alice' }
```

### `compactObject(obj)`

Recursively removes all `undefined` properties from an object or array. `null` values are preserved.

```typescript
compactObject({ a: 1, b: undefined, c: { d: undefined, e: 2 } });
// => { a: 1, c: { e: 2 } }
```

### `cloneDeep(obj)`

Creates a deep clone handling `Date`, `undefined`, `NaN`, `Infinity`, and circular references correctly.

```typescript
const original = { a: { b: 1 }, d: new Date() };
const clone = cloneDeep(original);
clone.a.b = 99;
original.a.b; // => 1 (unchanged)
clone.d instanceof Date; // => true
```

---

## Strings

```typescript
import { camelKeys, camelResponse, pascalCase, pascalCases, buildKey, buildKeys, isIdEmpty, slug } from '@sdflc/utils';
```

### `camelKeys(result)`

Recursively converts all object keys to camelCase. Handles arrays and nested objects. Leaves `Date` instances and primitives untouched.

```typescript
camelKeys({ first_name: 'John', last_name: 'Doe' });
// => { firstName: 'John', lastName: 'Doe' }

camelKeys([{ user_id: 1 }, { user_id: 2 }]);
// => [{ userId: 1 }, { userId: 2 }]
```

### `camelResponse(result)`

Converts object keys to camelCase. Returns the value unchanged if it is falsy or has a `rows` property (raw database result sets).

```typescript
camelResponse({ user_id: 1 }); // => { userId: 1 }
camelResponse(null); // => null
```

### `pascalCase(name)`

Converts a string to PascalCase.

```typescript
pascalCase('hello_world'); // => 'HelloWorld'
pascalCase('hello-world'); // => 'HelloWorld'
```

### `pascalCases(args)`

Recursively converts all keys in an object or array to PascalCase. Supports a `mapKey` override for specific keys.

```typescript
pascalCases({ src: { first_name: 'Alice' } });
// => { FirstName: 'Alice' }

pascalCases({ src: { id: 1, name: 'Alice' }, mapKey: { id: 'Id' } });
// => { Id: 1, Name: 'Alice' }
```

### `buildKey(keys)`

Converts a string, number, array, or object to a slug-based key string.

```typescript
buildKey('hello world'); // => 'hello-world'
buildKey(42); // => '42'
buildKey(['foo', 'bar']); // => 'foo-bar'
buildKey({ a: 1 }); // => '{"a":1}'
```

### `buildKeys(keys)`

Calls `buildKey` on each item in an array.

```typescript
buildKeys(['hello world', 42]); // => ['hello-world', '42']
```

### `isIdEmpty(value)`

Returns `true` if the value represents an empty/unset ID.

```typescript
isIdEmpty(null); // => true
isIdEmpty(''); // => true
isIdEmpty('0'); // => true
isIdEmpty(0); // => true
isIdEmpty(UUID_EMPTY); // => true
isIdEmpty('abc-123'); // => false
```

### `slug(str)`

Converts a string to a URL-friendly slug. Normalises Unicode/accented characters to ASCII equivalents.

```typescript
slug('Hello World!'); // => 'hello-world'
slug('café résumé'); // => 'cafe-resume'
slug('Привет мир'); // => 'privet-mir'
```

---

## String Helpers

```typescript
import {
  doesValueMatchAlphabet,
  isLengthBetween,
  areStringsEqual,
  replaceAt,
  insertAt,
  randomString,
  escapeRegExp,
  formatString,
  normalizeName,
} from '@sdflc/utils';
```

### `doesValueMatchAlphabet(value, alphabet)`

Returns `true` if every character in `value` is present in `alphabet`.

```typescript
doesValueMatchAlphabet('ABC123', 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'); // => true
doesValueMatchAlphabet('abc', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // => false
```

### `isLengthBetween(str, minLen, maxLen)`

Returns `true` if `str` length is between `minLen` and `maxLen` (inclusive).

```typescript
isLengthBetween('hello', 3, 10); // => true
isLengthBetween('hi', 3, 10); // => false
```

### `areStringsEqual(strLeft, strRight)`

Returns `true` if the two strings are equal ignoring case.

```typescript
areStringsEqual('Hello', 'hello'); // => true
```

### `replaceAt(str, index, replacement)`

Replaces characters in `str` starting at `index` with `replacement`.

```typescript
replaceAt('hello world', 6, 'there'); // => 'hello there'
```

### `insertAt(str, index, insert)`

Inserts `insert` into `str` at `index` without removing any characters.

```typescript
insertAt('helo', 3, 'l'); // => 'hello'
```

### `randomString(length, alphabet?)`

Generates a random string. Not suitable for cryptographic purposes.

```typescript
randomString(8); // => 'A3KF9Z2M'  (from default alphabet)
randomString(6, 'abc'); // => 'bcaabc'
```

### `escapeRegExp(str)`

Escapes all regex special characters so the string can be safely used in `new RegExp(...)`.

```typescript
escapeRegExp('{{name}}'); // => '\\{\\{name\\}\\}'
```

### `formatString(str, obj, opt?)`

Replaces `{{key}}` placeholders in a template string with values from `obj`. Delimiters are configurable. Null/undefined values leave the placeholder unchanged.

```typescript
formatString('Hello {{name}}!', { name: 'Alice' });
// => 'Hello Alice!'

formatString('Hi ${name}!', { name: 'Bob' }, { leftWrapper: '${', rightWrapper: '}' });
// => 'Hi Bob!'
```

### `normalizeName(name)`

Trims and lowercases a name string. Returns `undefined` for null/undefined input.

```typescript
normalizeName('  Alice  '); // => 'alice'
normalizeName(null); // => undefined
```

---

## StrOrderHelpers

```typescript
import { StrOrderHelpers } from '@sdflc/utils';
```

A counter that operates in any numeric base (default: base-36) using string representations. Useful for generating sortable string order keys.

```typescript
const order = new StrOrderHelpers({ start: '100', step: '5' });

order.current(); // => '100'
order.increase(); // => '105'
order.increase(); // => '10a'
order.decrease(); // => '105'
order.reset(); // => resets to '100'
```

### Arithmetic helpers

```typescript
order.add('1000', 'bb'); // => '10bb'
order.subtract('10cc', 'cc'); // => '1000'
order.addValue('aa'); // adds to current counter, returns new value
order.subtractValue('a'); // subtracts from current counter
```

### `valueBetween(valueA, valueB)`

Finds the midpoint between two values in the current base. Returns `null` if no distinct midpoint exists (adjacent or equal values).

```typescript
order.valueBetween('aaa', 'ccc'); // => 'bbb'
order.valueBetween('100', '104'); // => '102'
order.valueBetween('100', '101'); // => null
```

### Constructor options

| Option  | Type     | Default | Description              |
| ------- | -------- | ------- | ------------------------ |
| `start` | `string` | `'0'`   | Initial counter value    |
| `step`  | `string` | `'1'`   | Increment/decrement step |
| `base`  | `number` | `36`    | Numeric base (2–36)      |

---

## Transformers

```typescript
import { buildHierarchy, mapArrayBy, flattenHierarchy, getLowestLevelItems } from '@sdflc/utils';
```

### `buildHierarchy(arr, idField, parentIdField, nameForChildren)`

Converts a flat array into a tree structure. Items with no valid parent are roots; items whose parent isn't in the array are `orphans`.

```typescript
const flat = [
  { id: '1', parentId: null, name: 'Root' },
  { id: '2', parentId: '1', name: 'Child' },
];

buildHierarchy(flat, 'id', 'parentId', 'children');
// => {
//   tree: [{ id: '1', name: 'Root', children: [{ id: '2', name: 'Child', children: [] }] }],
//   orphans: []
// }
```

### `mapArrayBy(arr, mapBy, opt?)`

Maps an array of objects into a lookup object keyed by one or more fields.

```typescript
const arr = [
  { id: '1', val: 'a' },
  { id: '2', val: 'b' },
];

mapArrayBy(arr, 'id');
// => { '1': { id: '1', val: 'a' }, '2': { id: '2', val: 'b' } }

mapArrayBy(arr, 'id', { multiple: true });
// => { '1': [{ id: '1', val: 'a' }], '2': [{ id: '2', val: 'b' }] }

mapArrayBy(arr, ['id', 'val']);
// => { id: { '1': {...}, '2': {...} }, val: { a: {...}, b: {...} } }
```

### `flattenHierarchy(arr, nameForChildren, opt?)`

Flattens a tree into a depth-first ordered array.

```typescript
flattenHierarchy(tree, 'children');
// => [root, child1, grandchild1, child2, ...]

// With callback:
flattenHierarchy(tree, 'children', {
  onItem: (item) => console.log(item.name),
});
```

### `getLowestLevelItems(arr, idField, parentIdField, nameForChildren, setRoot?)`

Returns only the leaf nodes from a flat array. Optionally attaches a `rootId` to each leaf.

```typescript
getLowestLevelItems(flat, 'id', 'parentId', 'children', true);
// => [
//   { id: '4', ..., rootId: '1' },
//   { id: '5', ..., rootId: '1' },
// ]
```

---

## URL Params

```typescript
import { buildURLSearchParams } from '@sdflc/utils';
```

### `buildURLSearchParams(data)`

Converts a plain object into a `URLSearchParams` instance. Supports nested objects (dot notation), arrays (bracket notation), `Date` values, and mixed structures. Null and undefined values are omitted.

```typescript
buildURLSearchParams({ name: 'Alice', age: 30 }).toString();
// => 'name=Alice&age=30'

buildURLSearchParams({ tags: ['a', 'b'] }).toString();
// => 'tags[0]=a&tags[1]=b'

buildURLSearchParams({ address: { city: 'Calgary' } }).toString();
// => 'address.city=Calgary'

buildURLSearchParams({
  filters: [{ field: 'status', values: ['active', 'pending'] }],
}).toString();
// => 'filters[0].field=status&filters[0].values[0]=active&filters[0].values[1]=pending'

buildURLSearchParams({ createdAt: new Date('2025-01-01T00:00:00Z') }).toString();
// => 'createdAt=2025-01-01T00:00:00.000Z'
```

---

## License

MIT
