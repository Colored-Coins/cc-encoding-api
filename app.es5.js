#!/usr/bin/env node
'use strict';

var _ccPaymentEncoder = require('cc-payment-encoder');

var _ccPaymentEncoder2 = _interopRequireDefault(_ccPaymentEncoder);

var _bufferConsumer = require('buffer-consumer');

var _bufferConsumer2 = _interopRequireDefault(_bufferConsumer);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PROTOCOL = new Buffer([0x43, 0x43]),
    VERSION = new Buffer([0x02]),
    MAGICBYTES = Buffer.concat([PROTOCOL, VERSION]);

var encode = function encode(instructions) {
  return Buffer.concat([MAGICBYTES, _ccPaymentEncoder2.default.encodeBulk(instructions)]);
};
var decode = function decode(buff) {
  return (0, _assert2.default)(buff.slice(0, 3).equals(MAGICBYTES), 'invalid magic bytes'), _ccPaymentEncoder2.default.decodeBulk((0, _bufferConsumer2.default)(buff.slice(3)));
};

// Setup Express app
var app = require('express')();
app.set('port', process.env.PORT || 4050);

// Middleware
app.use(require('morgan')('dev'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').raw({ type: 'application/octet-stream' }));
app.use(function (req, res, next) {
  return req.body.hex && (req.body = new Buffer(req.body.hex.replace(/ /g, ''), 'hex')), next();
});

// API endpoints
app.post('/encode', function (req, res) {
  return res.send(encode(req.body));
});
app.post('/decode', function (req, res) {
  return res.send(decode(req.body));
});

app.use(function (req, res) {
  return res.sendStatus(404);
});

app.listen(app.get('port'), function (_) {
  return console.log('Running on port ' + app.get('port'));
});

