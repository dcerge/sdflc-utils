/**
 * Replace all empty strings in all the object properties to null values.
 * Example:
 * const srcObj = { firstName: 'John', lastName: '' };
 * const dstObj = setNullOnEmptyString(srcObj);
 * dstObj => { firstName: 'John', lastName: null };
 * @param {any} obj an object to process
 */
export const setNullOnEmptyString = (obj: any) => {
  const tmp: any = {};

  Object.keys(obj || {}).forEach((key) => {
    tmp[key] = obj[key] === '' ? null : obj[key];
  });

  return tmp;
};
