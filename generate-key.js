'use strict';

const sha1 = require('sha1');

module.exports = function init(obj) {
  return sha1(obj);
};
