/**
 * @fileOverview Object utilities.
 */

var ObjUtil = {};

/**
 * Checks an argument to see if it's an object.
 * @param {*} obj The argument to check.
 * @return {boolean}
 */
ObjUtil.isObject = function(obj) {
    return typeof(obj) === 'object' && obj !== null;
};

/**
 * Extend the first argument with keys and values from the second.
 * @param {object} obj
 * @param {object} obj2
 */
ObjUtil.extend = function(obj, obj2) {
    for (var key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            obj[key] = obj2[key];
        }
    }
};

module.exports = ObjUtil;
