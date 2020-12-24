/**
 * Replace all empty strings in all the object properties to null values.
 * Example:
 * const srcObj = { firstName: 'John', lastName: '' };
 * const dstObj = setNullOnEmptyString(srcObj);
 * dstObj => { firstName: 'John', lastName: null };
 * @param {any} obj an object to process
 */
export const setNullOnEmptyString = (obj: any): any => {
  const tmp: any = {};

  Object.keys(obj || {}).forEach((key) => {
    tmp[key] = obj[key] === '' ? null : obj[key];
  });

  return tmp;
};

/**
 * Creates an instance of type T
 * @param c Type instanceof which should be created
 * @example createInstance(MyClassName)
 */
// function createInstance<T>(c: new () => T): T {
//   return new c();
// }

/**
 * Takes an object and creates another object of `destinationType` type.
 * @param {any} source an object to process
 * @param {any} destinationType a class with properties to copy
 */
export function onlyPropsOf<T>(source: any, destinationType: new () => T): T {
  const result: any = new destinationType();

  Object.keys(result).forEach((key: string) => {
    result[key] = source && source[key];
  });

  return result;
}
