import { isIdEmpty } from './keys';

/**
 *
 * @param arr
 * @param idField
 * @param parentIdField
 * @param nameForChildren
 * @returns
 */
export const buildHierarchy = (arr: any[], idField: string, parentIdField: string, nameForChildren: string) => {
  const orphans: any[] = [];
  const tree: any[] = [];

  const mappedArr = arr.reduce((acc, item) => {
    acc[item[idField]] = item;
    acc[item[idField]][nameForChildren] = [];

    return acc;
  }, {});

  for (const key in mappedArr) {
    const item = mappedArr[key];
    const parentId = item[parentIdField];

    if (parentId !== undefined && isIdEmpty(parentId)) {
      // This is a root element
      tree.push(item);
    } else if (mappedArr[parentId]) {
      mappedArr[parentId][nameForChildren].push(item);
    } else {
      orphans.push(item);
    }
  }

  return { tree, orphans };
};

interface MapArrayByOptionsInterface {
  multiple: boolean;
}

/**
 * Maps array of objects by given mapBy field or array of fields
 * Example:
 * const arr = [{ a: 'AAA', b: 'BBB'}, { a: 'CCC', b: 'DDD' }]
 * const map1 = mapArrayBy(arr, 'a'); =>
 *  {
 *    AAA: { a: 'AAA', b: 'BBB'},
 *    CCC: { a: 'CCC', b: 'DDD' }
 *  }
 * const map2 = mapArrayBy(arr, ['a', 'b']); =>
 *  {
 *    a: { AAA: { a: 'AAA', b: 'BBB'}, CCC: { a: 'CCC', b: 'DDD' } },
 *    b: { BBB: { a: 'AAA', b: 'BBB'}, DDD: { a: 'CCC', b: 'DDD' } }
 *  }
 * @param {object[]} arr
 * @param {string|string[]} mapBy
 * @param {obj} opt Additional options: multiple - if true then the value of the map object is an array of items with similar key
 */
export const mapArrayBy = (arr: any[], mapBy: any, opt?: MapArrayByOptionsInterface) => {
  const isArray = Array.isArray(mapBy);
  const { multiple } = opt || {};

  if (isArray) {
    const emptyObj = mapBy.reduce((acc: any, item: string) => {
      acc[item] = {};
      return acc;
    }, {});

    return arr.reduce((acc, item) => {
      mapBy.forEach((mapByItem: any) => {
        if (multiple) {
          if (!acc[mapByItem][item[mapByItem]]) {
            acc[mapByItem][item[mapByItem]] = [];
          }
          acc[mapByItem][item[mapByItem]].push(item);
        } else {
          acc[mapByItem][item[mapByItem]] = item;
        }
      });

      return acc;
    }, emptyObj);
  } else {
    return arr.reduce((acc, item) => {
      if (multiple) {
        if (!acc[item[mapBy]]) {
          acc[item[mapBy]] = [];
        }
        acc[item[mapBy]].push(item);
      } else {
        acc[item[mapBy]] = item;
      }

      return acc;
    }, {});
  }
};
