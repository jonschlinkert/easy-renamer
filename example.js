'use strict';

var path = require('path');
var glob = require('matched');
var Renamer = require('./');
var renamer = new Renamer({destBase: 'foo/bar'});

renamer.matcher('test/fixtures/**/*.coffee', function(file) {
  return path.join(file.dirname, file.filename + '.js');
});

renamer.matcher('**/*.{hbs,txt}', function(file) {
  return path.join(file.dirname, file.filename + '.html');
});

renamer.matcher(/[a-c]\.md/, function(file) {
  return path.join(file.dirname, file.filename + '.html');
});

glob('test/fixtures/**/*', function(err, files) {
  if (err) return console.log(err);
  files.forEach(function(fp) {
    console.log('original: ' + fp);
    console.log('renamed:  ' + renamer.rename(fp));
    console.log('----')
  });
});
