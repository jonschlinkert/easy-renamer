/*!
 * easy-renamer <https://github.com/jonschlinkert/easy-renamer>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Matcher = require('./lib/matcher');
var utils = require('./lib/utils');

/**
 * Create an instance of `Renamer` with the given `options`.
 *
 * ```js
 * var renamer = new Renamer(options);
 * ```
 * @param {Object} `options`
 * @api public
 */

function Renamer(options) {
  if (!(this instanceof Renamer)) {
    return new Renamer(options);
  }
  this.options = options || {};
  this.matchers = {};
}

/**
 * Register a renaming function to use when a filepath matches the
 * given pattern.
 *
 * ```js
 * // rewrite file paths with `.txt` extensions
 * renamer.match('*.txt', function(file) {
 *   // `file` is an object containing the parsed parts of the file path
 *   return path.join(file.dirname, file.name + '.foo');
 * });
 * ```
 *
 * @param {String|RegExp} `pattern` Matchers used for matching, may be a regex or glob pattern.
 * @param {Function} Rename function to use when the file path matches the pattern.
 * @return {Object} Renamer instance, for chaining
 * @api public
 */

Renamer.prototype.matcher = function(pattern, opts, fn) {
  var key = this.makeKey(pattern);
  if (arguments.length === 1) {
    return this.matchers[key];
  }
  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }
  opts = utils.extend({}, this.options, opts);
  this.matchers[key] = new Matcher(pattern, opts, fn);
  return this;
};

/**
 * Rename a filepath using the function associated with a
 * registered pattern.
 *
 * ```js
 * renamer.match('*.txt', function(file) {
 *   return path.join(file.dirname, file.name + '.foo');
 * });
 * renamer.rename('a/b/c.txt');
 * //=> 'a/b/c.foo'
 * ```
 *
 * @param  {String} `fp`
 * @return {String} Renamed filepath.
 * @api public
 */

Renamer.prototype.rename = function(fp) {
  var keys = Object.keys(this.matchers);
  for (var i = 0; i < keys.length; i++) {
    var matcher = this.matcher(keys[i]);
    if (matcher.isMatch(fp)) {
      return matcher.rename(fp);
    }
  }
  return fp;
};

/**
 * Ensure that the `key` for a pattern is a string.
 *
 * @param  {String|RegExp} `key`
 * @return {String}
 */

Renamer.prototype.makeKey = function(key) {
  if (utils.typeOf(key) === 'regexp') {
    return key.source;
  }
  if (typeof key !== 'string') {
    throw new TypeError('Renamer expects matchers to be a string or regexp.');
  }
  return key;
};

/**
 * Expose `Renamer`
 */

module.exports = Renamer;

