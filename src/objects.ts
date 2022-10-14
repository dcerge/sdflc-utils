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

/**
 * Takes an object an removes all the props that are undefined
 * @param obj An object to compact
 * @returns object
 */
export const compactObject = (obj: any): any => {
  if (obj == null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => compactObject(item));
  } else if (typeof obj === 'object') {
    return Object.keys(obj ?? {}).reduce((acc: any, key: string) => {
      const value = obj[key];
      if (value != null && (typeof value === 'object' || Array.isArray(value))) {
        acc[key] = compactObject(value);
      } else if (obj[key] != undefined) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }

  return obj;
};
