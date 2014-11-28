
'use strict';

var url  = require('url');
var http = require('http');
var stream = require('stream');

function extend(base, object, excludes) {
  var keys = Object.keys(object);
  var i;
  excludes = excludes || [];

  for (i = 0; i < keys.length; i++) {
    if (excludes.indexOf(keys[i]) >= 0) continue;
    base[keys[i]] = object[keys[i]];
  }
}

function toMessage(req) {
  var msg = req.url ? url.parse(req.url) : {};

  var excludeKeys = [
    '_readableState',
    'readable',
    'domain',
    '_events',
    '_maxListeners',
    'socket',
    'connection',
    'complete',
    '_pendings',
    '_pendingIndex',
    'client',
    '_consuming',
    '_dumped',
    'addListener',
    'on',
    'pause',
    'pipe',
    'resume',
    'read'
  ];

  extend(msg, req, excludeKeys);
  if (!msg.body) msg.body = req;

  return msg;
}

function fromMessage(msg) {
  var req = {};
  var excludeKeys = [];

  if (msg.body._readableState) {
    req = msg.body;
    excludeKeys.push('body');
  }

  extend(req, msg, excludeKeys);

  return req;
}

module.exports.toMessage   = toMessage;
module.exports.fromMessage = fromMessage;
