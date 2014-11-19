
'use strict';

var url  = require('url');
var http = require('http');

function toMessage(req) {
  var urlParts = req.url ? url.parse(req.url) : {};

  // TODO serialize req properly in case of middleware altering request
  // properties. (e.g. body)

  return {
    httpVersion: req.httpVersion,
    method: req.method,
    url: req.url,
    host: urlParts.host,
    hostname: urlParts.hostname,
    path: urlParts.pathname,
    protocol: urlParts.protocol,
    port: urlParts.port,
    query: urlParts.query,
    params: null, // route params
    headers: req.headers,
    body: req.body ? req.body : req
  };
}

function fromMessage(msg) {
  var req = msg.body;
  var httpVersion = msg.httpVersion.split('.');
  req.httpVersionMajor = httpVersion.pop();
  req.httpVersionMinor = httpVersion.pop();
  req.httpVersion = msg.httpVersion;
  req.url = msg.url;
  req.method = msg.method;
  req.headers = msg.headers;

  return req;
}

module.exports.toMessage   = toMessage;
module.exports.fromMessage = fromMessage;
