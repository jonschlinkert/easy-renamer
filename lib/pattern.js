'use strict';

var utils = require('./utils');

function Pattern(pattern, opts, fn) {
  opts = opts || {};
  this.pattern = pattern;
  this.isMatch = function (fp) {
    return utils.mm.isMatch(fp, pattern, {contains: true});
  };

  this.rename = function (fp) {
    var parsed = utils.parseFilepath(fp);
    parsed.options = opts;
    return fn.call(this, parsed);
  };
}

/**
 * Expose `Pattern`
 */

module.exports = Pattern;
