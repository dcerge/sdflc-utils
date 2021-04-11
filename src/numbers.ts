/**
 * Rounds decimal `value` to `decimals` digits after point.
 * For example, 2.34567 => 2.35
 * @param {number} value
 */
export const roundNumberValue = (value: number, decimals?: number) => {
  return isNaN(value) ? NaN : Number(Number(value).toFixed(decimals || 2));
};

/**
 * Takes an object or array and goes through all his props and for numbers rounds up to 2 digits after point.
 * For example, { a: 2.34567, b: 45.213 } => { a: 2.35, b: 45.21 }
 * @param {number} obj Object to process
 */
export const roundNumberValues = (obj: any, decimals?: number) => {
  if (!obj) {
    return obj;
  }

  if (Array.isArray(obj)) {
    for (let idx = 0, len = obj.length; idx < len; idx++) {
      obj[idx] = roundNumberValues(obj[idx], decimals);
    }
  } else if (typeof obj === 'object') {
    Object.keys(obj || {}).forEach((field) => {
      if (typeof obj[field] === 'number') {
        obj[field] = roundNumberValue(obj[field], decimals);
      }
    });
  } else {
    obj = roundNumberValue(obj, decimals);
  }

  return obj;
};
