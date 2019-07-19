'use strict';

const sha1 = require('sha1');
const jsosort = require('jsosort');

module.exports = function init(obj) {
  obj = jsosort(obj);
  obj = JSON.stringify(obj, (key, val) => {
    return val instanceof RegExp ? String(val) : val;
  });
  return sha1(obj);
};
