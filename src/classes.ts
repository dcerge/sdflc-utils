/**
 * Creates an instance of type T
 * @param c Type instanceof which should be created
 * @example createInstance(MyClassName)
 */
function createInstance<T>(c: new () => T): T {
  return new c();
}

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
