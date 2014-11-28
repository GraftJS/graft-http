
'use strict';

var http    = require('http');
var through = require('through2');
var request = require('./request');

module.exports = function (middleware) {

  return through.obj(function(msg, enc, done) {
    // re-construct request
    var req = request.fromMessage(msg);

    // re-construct response
    var res = new http.ServerResponse(req);

    var that = this;

    function next(err) {
      if (err) {
        // failed!
        // TODO handle errors
      }

      var nextMsg = request.toMessage(req);
      nextMsg.res = msg.res;

      that.push(nextMsg);

      if (!res.writable) {
        // send back message
        msg.res.write({
          statusCode: res.statusCode,
          headers: res.headers,
          body: res
        });
      }

      done();
    }

    // call middleware
    middleware(req, res, next);
  });

};
