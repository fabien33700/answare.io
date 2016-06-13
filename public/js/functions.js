'use strict';

function stripAttributes(obj, attrs) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop) && attrs.indexOf(prop) > -1)
      delete obj[prop];
  }
}

Array.prototype.equals = function (dest) {
  let source = this.slice().sort();
  let target = dest.slice().sort();

  if (source.length !== target.length)
    return false;

  source.forEach(function (item, i) {
    if (item !== target[i]) return false;
  });

  return true;
}

function createArray(value, length) {
  var result = [];

  for (var i = 0; i < length; i++)
    result.push(value);

  return result;
}

function isdef(obj) {
  return typeof obj !== 'undefined';
}
