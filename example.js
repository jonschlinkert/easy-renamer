
var path = require('path');
var glob = require('glob');
var Renamer = require('./');
var renamer = new Renamer({destBase: 'foo/bar'});

renamer.pattern('fixtures/*.coffee', function (file) {
  return path.join(file.dirname, file.name + '.js');
});

renamer.pattern('**/*.txt', function (file) {
  return path.join(file.dirname, file.name + '.html');
});

renamer.pattern(/[a-c]\.md/, function (file) {
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
