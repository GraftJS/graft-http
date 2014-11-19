
'use strict';

var through = require('through2');

module.exports = function (pattern, opts) {

  var route = require('path-match')(opts || {});
  var match = route(pattern);

  return through.obj(function(msg, enc, done) {

    var params = match(msg.path);

    if (params === false) {
      // No match, return stream
      // 404 response here?
      msg.res.end();
    } else {
      msg.params = params;
      this.push(msg);
    }

    done();
  });
}
