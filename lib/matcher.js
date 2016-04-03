'use strict';

var utils = require('./utils');
var File = require('vinyl');
copy(File.prototype, 'stem', 'filename');

function Matcher(pattern, opts, fn) {
  opts = opts || {};
  this.pattern = pattern;

  function contains(fp) {
    return fp === pattern || utils.mm.contains(fp, pattern);
  }

  this.isMatch = function(file) {
    file = toFile(file, opts);
    return contains(file.path)
      || contains(file.relative)
      || contains(file.basename);
  };

  this.rename = function(file) {
    return fn.call(this, toFile(file, opts));
  };
}

function toFile(obj, opts) {
  if (typeof obj === 'string') {
    var filepath = obj;
    obj = { path: filepath };
  }
  var file = new File(obj);
  file.filepath = file.filename;
  file.options = opts;
  return file;
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
