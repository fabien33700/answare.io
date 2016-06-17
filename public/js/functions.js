'use strict';

/**
 * Namespace for Utils operation.
 */
var Utils = {};

/**
 * Removes from obj all attributes mentioned in attrs
 * @param Object obj The object
 * @param array attrs The attributes to remove
 */
Utils.removeAttr = function (obj, attrs) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop) && attrs.indexOf(prop) > -1)
        delete obj[prop];
    }
  };

/**
 * Compares two arrays, without considering items order.
 * @param array src The source array.
 * @param array dest The destination array.
 * @return boolean True if equals, false else.
 * @throws string The error message.
 */
Utils.compareArray = function (src, dest) {
  if (!Assert.isArray(src) ||
      !Assert.isArray(dest))
      throw "The arrays to compare must be non-empty ones.";

  src  = src.slice().sort();
  dest = dest.slice().sort();

  if (src.length !== dest.length)
    return false;

  for (var i = 0; i < src.length; i++)
      if (src[i] !== dest[i]) return false;

  return true;
};

/**
 * Creates an array with <length> item whose value is <value>
 * @param Object value The value to repeat in the array.
 * @param number length The newer array length.
 * @return array
 */
Utils.createArray = function (value, length) {
  var result = [];

  for (var i = 0; i < length; i++)
    result.push(value);

  return result;
};


/**
 * Creates a numeric range
 * @param number min The minimum value of the range.
 * @param number max The maximum value of the range.
 * @param number step The step of the range (1 by default).
 * @return array<number>
 */
Utils.createRange = function (min, max, step) {
  step = step || 1;
  var results = [];
  for (var i = min; i < max; i+=step)
    results.push(i);
  return results;
};

/**
 * Indicates wheters an array contains an item.
 * @param array array The array to test.
 * @param Object item The item to find.
 * @return boolean
 */
Utils.arrayContains = function (array, item) {
  if (!Array.isArray(array)) array = [array];
  for (let curr of array) if (curr === item) return true;
  return false;
};

/**
 * Namespace for simple assertion operation
 */
var Assert = {};

/**
 * Indicates whether given parameter is a boolean
 * @result boolean
 */
Assert.isBoolean = function (obj) {
    return typeof obj === 'boolean';
}

/**
 * Indicates whether given parameter is a string
 * @result boolean
 */
Assert.isString = function (obj) {
    return typeof obj === 'string';
}

/**
 * Indicates whether given parameter is an array
 * @result boolean
 */
Assert.isArray = function (obj) {
    return Array.isArray(obj);
}

/**
 * Indicates whether given parameter is an object (arrays are objects)
 * @result boolean
 */
Assert.isObject = function (obj) {
    return typeof obj === 'object';
}

/**
 * Indicates whether given parameter is a number
 * @result boolean
 */
Assert.isNumber = function (obj) {
    return typeof obj === 'number';
}

/**
 * Indicates whether given parameter is an integer
 * @result boolean
 */
Assert.isInteger = function (obj) {
    return ((Assert.isNumber(obj)) && (obj === Math.floor(obj)));
}

/**
 * Indicates whether given parameter is a float number
 * @result boolean
 */
Assert.isFloat = function (obj) {
    return ((this.isNumber(obj)) && (!this.isInteger(obj)));
}

/**
 * Indicates whether given parameter is a positive number
 * @result boolean
 */
Assert.isPositive = function (obj) {
    return this.isNumber(obj) && (obj >= 0);
}

/**
 * Indicates whether given parameter is a negative number
 * @result boolean
 */
Assert.isNegative = function (obj) {
    return this.isNumber(obj) && (obj < 0);
}

/**
 * Indicates whether given parameter is empty.
 * - number: is NaN
 * - string: length is 0
 * - array: length is 0
 * - object: number of own properties is 0
 * - <other>: false
 * @result boolean
 */
Assert.isEmpty = function (obj) {
    if (this.isNumber(obj))
      return obj == NaN;

    else if (this.isString(obj))
      return obj.length == 0;

    else if (this.isArray(obj))
      return obj.length == 0;

    else if ((this.isObject(obj)) && (!this.isArray(obj)))
      return Object.getOwnPropertyNames(obj).length == 0;

    else
      return false;
}

/**
 * Indicates whether given parameter is a non-empty string
 * @result boolean
 */
Assert.isFilledString = function (obj) {
    return ((this.isString(obj)) && (!this.isEmpty(obj)));
}

/**
 * Indicates whether given parameter is a non-empty array
 * @result boolean
 */
Assert.isFilledArray = function (obj) {
    return ((this.isArray(obj)) && (!this.isEmpty(obj)));
}

/**
 * Indicates whether given parameter is defined.
 * @result boolean
 */
Assert.isDefined = function (obj) {
  return typeof obj !== 'undefined';
}
