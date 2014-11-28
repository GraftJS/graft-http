
'use strict';

var graftHttp = require('./');
var http      = require('http');
var through   = require('through2');

var middleware = require('./lib/middleware');
var bodyParser = require('body-parser');

var server = graftHttp();
var router = require('./lib/router')();

server
  // using a connect compatible middleware
  // will parse body into object if request is application/json
  .pipe(middleware(bodyParser.json()))
  // simple router for routing micro services
  .pipe(router)

// echo micro service to pass through json data
router.route('/post/:id', through.obj(function(req, enc, done) {

    // route params
    console.log("requested id: ", req.params.id);

    // js object
    console.log("request body: ", req.body);

    req.res.end({
      statusCode: 200,
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(req.body)
    });

    done();

}));

http.createServer(server).listen(3000);
// or
// server.listen(3000);
// or
// connect.use(server);


var clientRequest = http.request({
  hostname: 'localhost',
  port: 3000,
  method: 'POST',
  path: '/post/15',
  headers: {
    'Content-Type': 'application/json',
  }
}, function(res) {
  res.setEncoding('utf8');
  res.on('data', console.log);
});

clientRequest.write('{"foo": "bar"}');
clientRequest.end();
