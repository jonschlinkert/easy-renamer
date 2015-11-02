'use strict';

require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var Renamer = require('./');
var renamer;

describe('renamer', function () {
  beforeEach(function () {
    renamer = new Renamer();
  });

  it('should store patterns on `renamer.patterns`:', function () {
    renamer.match('a', function() {});
    renamer.match('b', function() {});
    renamer.match('c', function() {});
    renamer.patterns.should.have.properties(['a', 'b', 'c']);
  });

  it('should rename a filepath that matches a pattern:`:', function () {
    renamer.match('*.txt', function(file) {
      return 'matched';
    });
    renamer.match('*.md', function(file) {
      return path.join(file.dirname, file.name + '.zzz');
    });

    renamer.rename('a.txt').should.equal('matched');
    renamer.rename('a/b/c.txt').should.equal('matched');
    renamer.rename('a.md').should.equal('a.zzz');
    renamer.rename('a.html').should.equal('a.html');
  });

  it('should pass options defined on the constructor to patterns:', function () {
    renamer = new Renamer({ destBase: 'foo/bar' });
    renamer.match('*.md', function(file) {
      var destBase = file.options.destBase || process.cwd();
      return path.join(destBase, file.dirname, file.name + '.zzz');
    });

    renamer.rename('a.txt').should.equal('a.txt');
    renamer.rename('a/b/c.txt').should.equal('a/b/c.txt');
    renamer.rename('a.md').should.equal('foo/bar/a.zzz');
    renamer.rename('a.html').should.equal('a.html');
  });
});
