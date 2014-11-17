
'use strict';

var graftHttp = require('./');
var http      = require('http');
var through   = require('through2');

// server
var server = graftHttp()

server.pipe(through.obj(function(msg, enc, done) {

  console.log("[request]", msg.method, msg.path);

  msg.res.end("Hello, world!");
  done();

}));

http.createServer(server).listen(3000);
// or
// server.listen(3000);
// or
// connect.use(server);
