'use strict';

var graft   = require('graft');
var http    = require('http');
var url     = require('url');
var merge   = require('utils-merge');

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

  // merge object with graft instance
  merge(handler, graft());

  // provide listen as a convenience function
  handler.listen = function() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
  }

  return handler;
}

module.exports = httpServer;
