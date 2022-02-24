import { VALUE_TYPES } from './constants';

/**
 * Converts provided string to specified type. If type is not supported throws and exception.
 * @param {any} value string value to be converted
 * @param {string} type name of type to convert the string to
 */
export const converStringToValue = (value: any, valueType: number) => {
  switch (valueType) {
    case VALUE_TYPES.STRING:
      return value;
    case VALUE_TYPES.NUMBER:
    case VALUE_TYPES.DECIMAL:
      return Number(value);
    case VALUE_TYPES.INTEGER:
      if (isNaN(value)) {
        return NaN;
      }
      return parseInt(value);
    case VALUE_TYPES.FLOAT:
      if (isNaN(value)) {
        return NaN;
      }
      return parseFloat(value);
    case VALUE_TYPES.BOOLEAN:
      return (value || '').toLowerCase() === 'true';
    default:
      throw Error(`Can't convert string value to the type '${valueType}' as it is unsupported`);
  }
};
