'use strict';

var graft   = require('graft');
var http    = require('http');
var url     = require('url');
var request = require('./lib/request');

function httpServer() {
  function handler(req, res, next) {
    handler.handle(req, res, next);
  }

  handler.graft = graft();

  handler.pipe = function() {
    return this.graft.pipe.apply(this.graft, arguments);
  }

  handler.handle = function(req, res, next) {
    var msg = request.toMessage(req);
    msg.res = this.graft.ReadChannel();

    msg.res.on('data', function(msg) {
      res.writeHead(msg.statusCode, msg.headers);
      if (typeof msg.body.pipe == 'function') {
        msg.body.pipe(res);
      } else {
        res.end(msg.body);
      }
      if (next) next();
    });

    this.graft.write(msg);
  }

  // provide listen as a convenience function
  handler.listen = function() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
  }

  return handler;
}

module.exports = httpServer;
