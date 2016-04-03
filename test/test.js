'use strict';

require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var Renamer = require('..');
var renamer;

describe('renamer', function() {
  beforeEach(function() {
    renamer = new Renamer({cwd: 'test/fixtures', realpath: true});
  });

  it('should store matchers on `renamer.matchers`:', function() {
    renamer.matcher('a', function() {});
    renamer.matcher('b', function() {});
    renamer.matcher('c', function() {});
    renamer.matchers.should.have.properties(['a', 'b', 'c']);
  });

  it('should rename a filepath that matches a pattern:`:', function() {
    renamer.matcher('*.txt', function(file) {
      return 'matched';
    });
    renamer.matcher('*.md', function(file) {
      file.extname = '.zzz';
      return file.path;
    });

    renamer.rename('a.txt').should.equal('matched');
    renamer.rename('a/b/c.txt').should.equal('matched');
    renamer.rename('a.md').should.equal('a.zzz');
    renamer.rename('a.html').should.equal('a.html');
  });

  it('should pass options defined on the constructor to matchers:', function() {
    renamer = new Renamer({ destBase: 'foo/bar' });
    renamer.matcher('*.md', function(file) {
      file.dirname = path.join(file.options.destBase, file.dirname);
      file.extname = '.zzz';
      return file.path;
    });
    renamer.matcher('*.txt', function(file) {
      file.dirname = path.join(file.options.destBase, file.dirname);
      file.extname = '.aaa';
      return file.path;
    });

    renamer.rename('a.txt').should.equal('foo/bar/a.aaa');
    renamer.rename('a/b/c.txt').should.equal('foo/bar/a/b/c.aaa');
    renamer.rename('a.md').should.equal('foo/bar/a.zzz');
    renamer.rename('a.html').should.equal('a.html');
  });
});
