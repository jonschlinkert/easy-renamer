'use strict';

var utils = require('./utils');
var File = require('vinyl');
copy(File.prototype, 'stem', 'filename');

function Matcher(pattern, opts, fn) {
  opts = opts || {};
  this.pattern = pattern;

  this.isMatch = function (filepath) {
    return utils.mm.contains(filepath, pattern);
  };

  this.rename = function (obj) {
    if (typeof obj === 'string') {
      var filepath = obj;
      obj = { path: filepath };
    }

    var file = new File(obj);
    file.filepath = file.filename;
    file.options = opts;
    return fn.call(this, file);
  };
}

function copy(provider, receiver, from, to) {
  if (typeof receiver === 'string') {
    to = from;
    from = receiver;
    receiver = provider;
  }
  if (typeof to !== 'string') {
    to = from;
  }
  var val = Object.getOwnPropertyDescriptor(provider, from);
  if (val) Object.defineProperty(provider, to, val);
}

/**
 * Expose `Matcher`
 */

module.exports = Matcher;
