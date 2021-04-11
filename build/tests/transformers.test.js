"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
describe('Transformers tests', function () {
    test('Transformers: Building hierarchy', function () {
        var src = [
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
        var dst = {
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
        expect(__1.buildHierarchy(src, 'id', 'parentId', 'children')).toEqual(dst);
    });
    test('Transformers: mapArrayBy', function () {
        var src = [
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
        var dstOne = {
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
        var dstMulti = {
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
        expect(__1.mapArrayBy(src, 'id')).toEqual(dstOne);
        expect(__1.mapArrayBy(src, 'id', { multiple: true })).toEqual(dstMulti);
    });
});
