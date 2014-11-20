
'use strict';

var through = require('through2');

function router(opts) {
  var route = require('path-match')(opts || {});

  var service = through.obj(function(msg, enc, done) {

      var i, match, params;

      for(i = 0; i < this._routes.length; i++) {
        match = route(this._routes[i].pattern);
        params = match(msg.path);

        if (params == false) continue;

        msg.params = params;
        this.push(msg);

        this._routes[i].stream.write(msg, done);
        return;
      }

      done();
  });

  service._routes = [];

  service.route = function(pattern, stream) {
    this._routes.push({
      pattern: pattern,
      stream: stream
    });
  };

  return service;
}

module.exports = router;
