'use strict';

var Utils = {};

Utils.removeAttr = function (obj, attrs) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop) && attrs.indexOf(prop) > -1)
        delete obj[prop];
    }
  };

Utils.compareArray = function (src, dest) {
  if (!Utils.assertArray(src) ||
      !Utils.assertArray(dest))
      throw "The arrays to compare must be non-empty ones.";

  src  = src.slice().sort();
  dest = dest.slice().sort();

  if (src.length !== dest.length)
    return false;

  for (var i = 0; i < src.length; i++) {
      if (src[i] !== dest[i]) return false;
  }

  return true;
};

Utils.createArray = function (value, length) {
  var result = [];

  for (var i = 0; i < length; i++)
    result.push(value);

  return result;
};

Utils.isDefined = function (obj) {
  return typeof obj !== 'undefined';
};

Utils.createRange = function (min, max) {
  var results = [];
  for (var i = min; i < max; i++)
    results.push(i);
  return results;
};

/*Utils.compareAnswer = function (user, correct) {
  return (Array.isArray(correct)) ? Utils.compareArray(user, correct) : (user === correct[0]);
};*/

Utils.arrayContains = function (array, item) {
  if (!Array.isArray(array)) array = [array];
  for (let curr of array) if (curr === item) return true;
  return false;
};

Utils.assertString = function (obj) {
    return (
      (typeof obj === "string") &&
      (obj.length > 0)
    );
};

Utils.assertArray = function (obj) {
    return (
      (Array.isArray(obj)) &&
      (obj.length > 0)
    );
};

Utils.assertPositiveInteger = function (obj) {
    return (
      (typeof obj === "number") &&
      (obj >= 0)
    );
};
