/**
 * Convert an array of objects into an object which properties names and values are taken from nameKey and valueKey of each item.
 * Example:
 * const arr = [{ name: 'status', value: 'active' }, { name: 'name', value: 'Some name' }];
 * const obj = arrayToObject(arr, 'name', 'value');
 * obj => { status: 'active', name: 'Some name' }
 * @param arr array of object to process
 * @param nameKey an object property name to use for retrieving new object property name
 * @param valueKey an object property name to use for retrieving new object property value
 * @returns {object} an object with properties and values taken from the input array
 */
export const arrayToObject = (arr: Array<object>, nameKey: string, valueKey: string) => {
  const obj = {};

  if (arr instanceof Array === false) {
    return obj;
  }

  return arr.reduce((acc: any, item: any) => {
    acc[item[nameKey]] = item[valueKey];
    return acc;
  }, obj);
};

/**
 * Uppercase each string in the array
 * @param {string[]} arr arrays of string to upper case
 */
export const arrToUpperCase = (arr: string[]) => {
  return (arr || []).map(item => (item || '').toUpperCase());
};

/**
 * Lowercase each string in the array
 * @param {string[]} arr arrays of string to lower case
 */
export const arrToLowerCase = (arr: string[]) => {
  return (arr || []).map(item => (item || '').toLowerCase());
};
