// ./src/transformers.ts

import { isIdEmpty } from './keys';

// =============================================================================
// buildHierarchy
// =============================================================================

interface BuildHierarchyResult {
  tree: any[];
  orphans: any[];
}

/**
 * Converts a flat array of objects into a tree structure based on id/parentId
 * relationships.
 *
 * Items whose `parentIdField` is empty (null, undefined, '0', UUID_ZERO, etc.)
 * are treated as root nodes. Items whose parent does not exist in the array
 * are collected in `orphans`.
 *
 * Note: items are shallow-cloned so that the `nameForChildren` property is
 * added to the clone rather than mutating the original objects.
 *
 * @param arr              - Flat array of items to convert.
 * @param idField          - Property name that holds each item's unique ID.
 * @param parentIdField    - Property name that holds each item's parent ID.
 * @param nameForChildren  - Property name to use for the children array.
 * @returns `{ tree, orphans }` — root-level nodes and unattached items.
 */
export const buildHierarchy = (
  arr: any[],
  idField: string,
  parentIdField: string,
  nameForChildren: string,
): BuildHierarchyResult => {
  if (!Array.isArray(arr)) return { tree: [], orphans: [] };

  const orphans: any[] = [];
  const tree: any[] = [];

  // Shallow-clone each item and initialise its children array
  const mappedArr = arr.reduce(
    (acc, item) => {
      acc[item[idField]] = { ...item, [nameForChildren]: [] };
      return acc;
    },
    {} as Record<string, any>,
  );

  for (const key in mappedArr) {
    const item = mappedArr[key];
    const parentId = item[parentIdField];

    if (isIdEmpty(parentId)) {
      // Root element — no valid parent
      tree.push(item);
    } else if (mappedArr[parentId]) {
      mappedArr[parentId][nameForChildren].push(item);
    } else {
      orphans.push(item);
    }
  }

  return { tree, orphans };
};

// =============================================================================
// mapArrayBy
// =============================================================================

interface MapArrayByOptionsInterface {
  multiple?: boolean;
}

/**
 * Maps an array of objects into a lookup object keyed by a given field (or
 * set of fields).
 *
 * @example
 * const arr = [{ a: 'AAA', b: 'BBB' }, { a: 'CCC', b: 'DDD' }];
 *
 * mapArrayBy(arr, 'a')
 * // => { AAA: { a: 'AAA', b: 'BBB' }, CCC: { a: 'CCC', b: 'DDD' } }
 *
 * mapArrayBy(arr, ['a', 'b'])
 * // => {
 * //      a: { AAA: { a: 'AAA', b: 'BBB' }, CCC: { a: 'CCC', b: 'DDD' } },
 * //      b: { BBB: { a: 'AAA', b: 'BBB' }, DDD: { a: 'CCC', b: 'DDD' } }
 * //    }
 *
 * @param arr   - Source array.
 * @param mapBy - Field name or array of field names to key by.
 * @param opt   - `multiple: true` collects items with the same key into an array.
 */
export const mapArrayBy = (
  arr: any[],
  mapBy: string | string[],
  opt?: MapArrayByOptionsInterface,
): Record<string, any> => {
  if (!Array.isArray(arr)) return {};

  const isArray = Array.isArray(mapBy);
  const multiple = opt?.multiple ?? false;

  if (isArray) {
    const emptyObj = (mapBy as string[]).reduce(
      (acc, item) => {
        acc[item] = {};
        return acc;
      },
      {} as Record<string, any>,
    );

    return arr.reduce((acc, item) => {
      (mapBy as string[]).forEach((mapByItem) => {
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
  }

  return arr.reduce(
    (acc, item) => {
      if (multiple) {
        if (!acc[item[mapBy as string]]) {
          acc[item[mapBy as string]] = [];
        }
        acc[item[mapBy as string]].push(item);
      } else {
        acc[item[mapBy as string]] = item;
      }
      return acc;
    },
    {} as Record<string, any>,
  );
};

// =============================================================================
// flattenHierarchy
// =============================================================================

interface FlattenHierarchyOptions {
  onItem?(item: any): void;
}

/**
 * Takes an array of objects where each object may have a children array and
 * returns a single flat array containing every node in depth-first order.
 *
 * @param arr              - Array of root-level items with nested children.
 * @param nameForChildren  - Property name that holds each item's children array.
 * @param opt              - `onItem` callback invoked for every item visited.
 * @returns Flat array of all nodes.
 */
export const flattenHierarchy = (arr: any[], nameForChildren: string, opt?: FlattenHierarchyOptions): any[] => {
  if (!Array.isArray(arr)) return [];

  const acc: any[] = [];

  const fn = (nodes: any[]) => {
    nodes.forEach((item) => {
      if (typeof opt?.onItem === 'function') {
        opt.onItem(item);
      }

      acc.push(item);

      const children = item[nameForChildren];
      if (Array.isArray(children) && children.length > 0) {
        fn(children);
      }
    });
  };

  fn(arr);

  return acc;
};

// =============================================================================
// getLowestLevelItems
// =============================================================================

/**
 * Accepts a flat array, builds a hierarchy, then returns only the leaf nodes
 * (items with no children).
 *
 * @param arr              - Flat array of items.
 * @param idField          - Property name that holds each item's unique ID.
 * @param parentIdField    - Property name that holds each item's parent ID.
 * @param nameForChildren  - Property name used for children arrays.
 * @param setRoot          - If `true`, a `rootId` property is added to each
 *                           leaf containing the ID of its root ancestor.
 *                           Added to a shallow clone — original items are not mutated.
 * @returns Array of leaf node items.
 */
export const getLowestLevelItems = (
  arr: any[],
  idField: string,
  parentIdField: string,
  nameForChildren: string,
  setRoot?: boolean,
): any[] => {
  const { tree } = buildHierarchy(arr, idField, parentIdField, nameForChildren);
  const items: any[] = [];

  const recursion = (children: any[], rootId?: any) => {
    children.forEach((child) => {
      if (Array.isArray(child[nameForChildren]) && child[nameForChildren].length > 0) {
        recursion(child[nameForChildren], rootId ?? child[idField]);
      } else {
        // Shallow-clone to avoid mutating the tree node
        items.push(setRoot === true ? { ...child, rootId } : child);
      }
    });
  };

  recursion(tree);

  return items;
};
