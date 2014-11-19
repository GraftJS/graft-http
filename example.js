
'use strict';

var graftHttp = require('./');
var http      = require('http');
var through   = require('through2');

var graftMiddleware = require('./lib/middleware');
var bodyParser = require('body-parser');

// server
var graftHttp = graftHttp();

// using a connect compatible middleware
// will parse body into object if request is application/json
graftHttp.use(graftMiddleware(bodyParser.json()))
  // echo micro service to pass through json data
  .pipe(through.obj(function(req, enc, done) {

    // js object
    console.log(req.body);

    req.res.end({
      statusCode: 200,
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(req.body)
    })

    done();

  }));

http.createServer(graftHttp).listen(3000);
// or
// server.listen(3000);
// or
// connect.use(server);


var clientRequest = http.request({
  hostname: 'localhost',
  port: 3000,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}, function(res) {
  res.setEncoding('utf8');
  res.on('data', console.log);
});

clientRequest.write('{"foo": "bar"}');
clientRequest.end();
