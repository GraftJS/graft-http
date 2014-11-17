'use strict';

var graft   = require('graft');
var http    = require('http');
var url     = require('url');

function httpServer() {
  function handler(req, res, next) {
    handler.write({
      method: req.method,
      path: url.parse(req.url).pathname,
      url: req.url,
      req: req,
      res: res
    });
  }

  handler.graft = graft();

  handler.pipe = function() {
    this.graft.pipe.apply(this.graft, arguments);
    return this;
  }

  handler.write = function() {
    this.graft.write.apply(this.graft, arguments);
    return this;
  }

  // provide listen as a convenience function
  handler.listen = function() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
  }

  return handler;
}

module.exports = httpServer;
