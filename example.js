
var path = require('path');
var glob = require('globby');
var Renamer = require('./');
var renamer = new Renamer({destBase: 'foo/bar'});

renamer.match('fixtures/*.coffee', function (file) {
  return path.join(file.dirname, file.name + '.js');
});

renamer.match('**/*.txt', function (file) {
  return path.join(file.dirname, file.name + '.html');
});

renamer.match(/[a-c]\.md/, function (file) {
  return path.join(file.dirname, file.name + '.html');
});

glob('fixtures/**/*', function (err, files) {
  if (err) return console.log(err);
  files.forEach(function (fp) {
    console.log('original: ' + fp);
    console.log('renamed:  ' + renamer.rename(fp));
    console.log('----')
  });
});
