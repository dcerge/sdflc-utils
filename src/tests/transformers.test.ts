// ./src/tests/transformers.test.ts

import { buildHierarchy, mapArrayBy, flattenHierarchy, getLowestLevelItems } from '../';

// =============================================================================
// buildHierarchy
// =============================================================================
describe('buildHierarchy', () => {
  const src = [
    { id: '1', value: 'root', parentId: null },
    { id: '4', value: 'child 2.1', parentId: '2' },
    { id: '2', value: 'child 1.1', parentId: '1' },
    { id: '3', value: 'child 1.2', parentId: '1' },
    { id: '5', value: 'child 3.1', parentId: '3' },
    { id: '6', value: 'orphan', parentId: '9' },
  ];

  it('builds the correct tree and orphans list', () => {
    expect(buildHierarchy(src, 'id', 'parentId', 'children')).toEqual({
      tree: [
        {
          id: '1',
          value: 'root',
          parentId: null,
          children: [
            {
              id: '2',
              value: 'child 1.1',
              parentId: '1',
              children: [{ id: '4', value: 'child 2.1', parentId: '2', children: [] }],
            },
            {
              id: '3',
              value: 'child 1.2',
              parentId: '1',
              children: [{ id: '5', value: 'child 3.1', parentId: '3', children: [] }],
            },
          ],
        },
      ],
      orphans: [{ id: '6', value: 'orphan', parentId: '9', children: [] }],
    });
  });

  it('does not mutate the original items', () => {
    const snapshots = src.map((o) => ({ ...o }));
    buildHierarchy(src, 'id', 'parentId', 'children');
    src.forEach((item, i) => expect(item).toEqual(snapshots[i]));
  });

  it('treats undefined parentId as root', () => {
    const items = [
      { id: '1', name: 'Root' },
      { id: '2', parentId: '1', name: 'Child' },
    ];
    const { tree } = buildHierarchy(items, 'id', 'parentId', 'children');
    expect(tree).toHaveLength(1);
    expect(tree[0].children[0].name).toBe('Child');
  });

  it('treats "0" parentId as root', () => {
    const items = [
      { id: '1', parentId: '0', name: 'Root' },
      { id: '2', parentId: '1', name: 'Child' },
    ];
    const { tree } = buildHierarchy(items, 'id', 'parentId', 'children');
    expect(tree).toHaveLength(1);
  });

  it('uses a custom nameForChildren property', () => {
    const items = [
      { id: '1', parentId: null, name: 'Root' },
      { id: '2', parentId: '1', name: 'Child' },
    ];
    const { tree } = buildHierarchy(items, 'id', 'parentId', 'items');
    expect(tree[0].items).toHaveLength(1);
    expect(tree[0].children).toBeUndefined();
  });

  it('returns empty tree and orphans for null input', () => {
    expect(buildHierarchy(null as any, 'id', 'parentId', 'children')).toEqual({ tree: [], orphans: [] });
  });

  it('returns empty tree and orphans for empty array', () => {
    expect(buildHierarchy([], 'id', 'parentId', 'children')).toEqual({ tree: [], orphans: [] });
  });
});

// =============================================================================
// mapArrayBy
// =============================================================================
describe('mapArrayBy', () => {
  const src = [
    { id: '1', value: 1 },
    { id: '2', value: 2 },
    { id: '3', value: 3 },
    { id: '1', value: 10 }, // duplicate key — last wins in single mode
  ];

  it('maps by a single field (last item wins on duplicate key)', () => {
    expect(mapArrayBy(src, 'id')).toEqual({
      '1': { id: '1', value: 10 },
      '2': { id: '2', value: 2 },
      '3': { id: '3', value: 3 },
    });
  });

  it('collects duplicates into arrays when multiple: true', () => {
    expect(mapArrayBy(src, 'id', { multiple: true })).toEqual({
      '1': [
        { id: '1', value: 1 },
        { id: '1', value: 10 },
      ],
      '2': [{ id: '2', value: 2 }],
      '3': [{ id: '3', value: 3 }],
    });
  });

  it('maps by multiple fields', () => {
    const arr = [
      { a: 'AAA', b: 'BBB' },
      { a: 'CCC', b: 'DDD' },
    ];
    const result = mapArrayBy(arr, ['a', 'b']);
    expect(result.a).toEqual({ AAA: { a: 'AAA', b: 'BBB' }, CCC: { a: 'CCC', b: 'DDD' } });
    expect(result.b).toEqual({ BBB: { a: 'AAA', b: 'BBB' }, DDD: { a: 'CCC', b: 'DDD' } });
  });

  it('collects into arrays for multiple fields with multiple: true', () => {
    const data = [
      { type: 'fruit', color: 'red', name: 'apple' },
      { type: 'fruit', color: 'yellow', name: 'banana' },
      { type: 'veg', color: 'red', name: 'tomato' },
    ];
    const result = mapArrayBy(data, ['type', 'color'], { multiple: true });
    expect(result.type.fruit).toHaveLength(2);
    expect(result.color.red).toHaveLength(2);
  });

  it('returns {} for null input', () => {
    expect(mapArrayBy(null as any, 'id')).toEqual({});
  });

  it('returns {} for empty array', () => {
    expect(mapArrayBy([], 'id')).toEqual({});
  });
});

// =============================================================================
// flattenHierarchy
// =============================================================================
describe('flattenHierarchy', () => {
  const src = [
    {
      id: '1',
      value: 'root',
      parentId: null,
      children: [
        {
          id: '2',
          value: 'child 1.1',
          parentId: '1',
          children: [{ id: '4', value: 'child 2.1', parentId: '2', children: [] }],
        },
        {
          id: '3',
          value: 'child 1.2',
          parentId: '1',
          children: [{ id: '5', value: 'child 3.1', parentId: '3', children: [] }],
        },
      ],
    },
    { id: '6', value: 'child 3', parentId: null, children: [] },
  ];

  it('flattens a hierarchy in depth-first order', () => {
    expect(flattenHierarchy(src, 'children')).toEqual([
      {
        id: '1',
        value: 'root',
        parentId: null,
        children: [
          {
            id: '2',
            value: 'child 1.1',
            parentId: '1',
            children: [{ id: '4', value: 'child 2.1', parentId: '2', children: [] }],
          },
          {
            id: '3',
            value: 'child 1.2',
            parentId: '1',
            children: [{ id: '5', value: 'child 3.1', parentId: '3', children: [] }],
          },
        ],
      },
      {
        id: '2',
        value: 'child 1.1',
        parentId: '1',
        children: [{ id: '4', value: 'child 2.1', parentId: '2', children: [] }],
      },
      { id: '4', value: 'child 2.1', parentId: '2', children: [] },
      {
        id: '3',
        value: 'child 1.2',
        parentId: '1',
        children: [{ id: '5', value: 'child 3.1', parentId: '3', children: [] }],
      },
      { id: '5', value: 'child 3.1', parentId: '3', children: [] },
      { id: '6', value: 'child 3', parentId: null, children: [] },
    ]);
  });

  it('calls onItem callback for every node visited', () => {
    const visited: string[] = [];
    flattenHierarchy(src, 'children', { onItem: (item) => visited.push(item.id) });
    expect(visited).toEqual(['1', '2', '4', '3', '5', '6']);
  });

  it('handles nodes with no children property', () => {
    const simple = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ];
    expect(flattenHierarchy(simple, 'children')).toHaveLength(2);
  });

  it('returns [] for null input', () => {
    expect(flattenHierarchy(null as any, 'children')).toEqual([]);
  });

  it('returns [] for empty array', () => {
    expect(flattenHierarchy([], 'children')).toEqual([]);
  });
});

// =============================================================================
// getLowestLevelItems
// =============================================================================
describe('getLowestLevelItems', () => {
  const src = [
    { id: '1', value: 'root', parentId: null },
    { id: '4', value: 'child 2.1', parentId: '2' },
    { id: '2', value: 'child 1.1', parentId: '1' },
    { id: '3', value: 'child 1.2', parentId: '1' },
    { id: '5', value: 'child 3.1', parentId: '3' },
    { id: '6', value: 'orphan', parentId: '9' },
  ];

  it('returns leaf nodes with rootId when setRoot is true', () => {
    expect(getLowestLevelItems(src, 'id', 'parentId', 'children', true)).toEqual([
      { id: '4', value: 'child 2.1', parentId: '2', children: [], rootId: '1' },
      { id: '5', value: 'child 3.1', parentId: '3', children: [], rootId: '1' },
    ]);
  });

  it('excludes orphans from results', () => {
    const result = getLowestLevelItems(src, 'id', 'parentId', 'children', true);
    expect(result.find((n) => n.value === 'orphan')).toBeUndefined();
  });

  it('does not add rootId when setRoot is false', () => {
    const result = getLowestLevelItems(src, 'id', 'parentId', 'children', false);
    result.forEach((item) => expect(item.rootId).toBeUndefined());
  });

  it('does not mutate original items when setRoot is true', () => {
    const snapshots = src.map((o) => ({ ...o }));
    getLowestLevelItems(src, 'id', 'parentId', 'children', true);
    src.forEach((item, i) => expect(item).toEqual(snapshots[i]));
  });

  it('returns [] for empty array', () => {
    expect(getLowestLevelItems([], 'id', 'parentId', 'children')).toEqual([]);
  });
});
