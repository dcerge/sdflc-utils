import { buildHierarchy, mapArrayBy } from '../';

describe('Transformers tests', () => {
  test('Transformers: Building hierarchy', () => {
    const src = [
      {
        id: '1',
        value: 'root',
        parentId: null,
      },
      {
        id: '4',
        value: 'child 2.1',
        parentId: '2',
      },
      {
        id: '2',
        value: 'child 1.1',
        parentId: '1',
      },
      {
        id: '3',
        value: 'child 1.2',
        parentId: '1',
      },
      {
        id: '5',
        value: 'child 3.1',
        parentId: '3',
      },
      {
        id: '6',
        value: 'orphan',
        parentId: '9',
      },
    ];

    const dst = {
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
              children: [
                {
                  id: '4',
                  value: 'child 2.1',
                  parentId: '2',
                  children: [],
                },
              ],
            },
            {
              id: '3',
              value: 'child 1.2',
              parentId: '1',
              children: [
                {
                  id: '5',
                  value: 'child 3.1',
                  parentId: '3',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
      orphans: [
        {
          id: '6',
          value: 'orphan',
          parentId: '9',
          children: [],
        },
      ],
    };

    expect(buildHierarchy(src, 'id', 'parentId', 'children')).toEqual(dst);
  });

  test('Transformers: mapArrayBy', () => {
    const src = [
      {
        id: '1',
        value: 1,
      },
      {
        id: '2',
        value: 2,
      },
      {
        id: '3',
        value: 3,
      },
      {
        id: '1',
        value: 10,
      },
    ];

    const dstOne = {
      '1': {
        id: '1',
        value: 10,
      },
      '2': {
        id: '2',
        value: 2,
      },
      '3': {
        id: '3',
        value: 3,
      },
    };

    const dstMulti = {
      '1': [
        {
          id: '1',
          value: 1,
        },
        {
          id: '1',
          value: 10,
        },
      ],
      '2': [
        {
          id: '2',
          value: 2,
        },
      ],
      '3': [
        {
          id: '3',
          value: 3,
        },
      ],
    };

    expect(mapArrayBy(src, 'id')).toEqual(dstOne);
    expect(mapArrayBy(src, 'id', { multiple: true })).toEqual(dstMulti);
  });
});
