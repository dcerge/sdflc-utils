"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapArrayBy = exports.buildHierarchy = void 0;
var keys_1 = require("./keys");
/**
 *
 * @param arr
 * @param idField
 * @param parentIdField
 * @param nameForChildren
 * @returns
 */
var buildHierarchy = function (arr, idField, parentIdField, nameForChildren) {
    var orphans = [];
    var tree = [];
    var mappedArr = arr.reduce(function (acc, item) {
        acc[item[idField]] = item;
        acc[item[idField]][nameForChildren] = [];
        return acc;
    }, {});
    for (var key in mappedArr) {
        var item = mappedArr[key];
        var parentId = item[parentIdField];
        if (parentId !== undefined && keys_1.isIdEmpty(parentId)) {
            // This is a root element
            tree.push(item);
        }
        else if (mappedArr[parentId]) {
            mappedArr[parentId][nameForChildren].push(item);
        }
        else {
            orphans.push(item);
        }
    }
    return { tree: tree, orphans: orphans };
};
exports.buildHierarchy = buildHierarchy;
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
var mapArrayBy = function (arr, mapBy, opt) {
    var isArray = Array.isArray(mapBy);
    var multiple = (opt || {}).multiple;
    if (isArray) {
        var emptyObj = mapBy.reduce(function (acc, item) {
            acc[item] = {};
            return acc;
        }, {});
        return arr.reduce(function (acc, item) {
            mapBy.forEach(function (mapByItem) {
                if (multiple) {
                    if (!acc[mapByItem][item[mapByItem]]) {
                        acc[mapByItem][item[mapByItem]] = [];
                    }
                    acc[mapByItem][item[mapByItem]].push(item);
                }
                else {
                    acc[mapByItem][item[mapByItem]] = item;
                }
            });
            return acc;
        }, emptyObj);
    }
    else {
        return arr.reduce(function (acc, item) {
            if (multiple) {
                if (!acc[item[mapBy]]) {
                    acc[item[mapBy]] = [];
                }
                acc[item[mapBy]].push(item);
            }
            else {
                acc[item[mapBy]] = item;
            }
            return acc;
        }, {});
    }
};
exports.mapArrayBy = mapArrayBy;
