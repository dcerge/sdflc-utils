const addParam = (params: URLSearchParams, paramName: string, paramValue: any) => {
  if (Array.isArray(paramValue)) {
    paramValue.forEach((value: any, idx: number) => {
      const fullKey = paramName ? `${paramName}[${idx}]` : '';
      addParam(params, fullKey, value);
    });
  } else if (typeof paramValue !== 'object') {
    params.append(paramName, paramValue);
  } else {
    Object.keys(paramValue).forEach((key: string) => {
      const fullKey = paramName ? `${paramName}.${key}` : key;
      addParam(params, fullKey, paramValue[key]);
    });
  }
};

/**
 * Takes an object and adds its props to URLSearchParams.
 * The function can work with arrays of objects
 * and with object properties that are arrays.
 * @param data An object to add to URLSearchParams
 * @returns An object of URLSearchParams type
 */
export const buildURLSearchParams = (data: any) => {
  const params = new URLSearchParams();

  if (!data) {
    return params;
  }

  addParam(params, '', data);

  return params;
};
