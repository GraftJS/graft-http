
'use strict';

var graftHttp = require('./');
var http      = require('http');
var through   = require('through2');

var connect   = require('connect');

var app = connect();

// server
var graft = graftHttp()

app.use('/test', graft.pipe(through.obj(function(msg, enc, done) {

  console.log("[request]", msg.method, msg.path);

  msg.res.end("Hello, world!");
  done();

})));

http.createServer(app).listen(3000);
// or
// server.listen(3000);
// or
// connect.use(server);
