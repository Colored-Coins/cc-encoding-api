#!/usr/bin/env node

import paymentEncoder from 'cc-payment-encoder'
import consumer from 'buffer-consumer'
import assert from 'assert'

const PROTOCOL = new Buffer([ 0x43, 0x43 ])
    , VERSION = new Buffer([ 0x02  ])
    , MAGICBYTES = Buffer.concat([ PROTOCOL, VERSION ])

const encode = instructions => Buffer.concat([ MAGICBYTES, paymentEncoder.encodeBulk(instructions) ])
const decode = buff => (
  assert(buff.slice(0, 3).equals(MAGICBYTES), 'invalid magic bytes'),
  paymentEncoder.decodeBulk(consumer(buff.slice(3)))
)

// Setup Express app
const app = require('express')()
app.set('port', process.env.PORT || 4050)
app.set('host', process.env.HOST || '127.0.0.1')

// Middleware
app.use(require('morgan')('dev'))
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({ extended: false }))
app.use(require('body-parser').raw({ type: 'application/octet-stream' }))
app.use((req, res, next) => ((req.body.hex && (req.body=new Buffer(req.body.hex.replace(/ /g, ''), 'hex'))), next()))

// API endpoints
app.post('/encode', (req, res) => res.send(encode(req.body)))
app.post('/decode', (req, res) => res.send(decode(req.body)))

app.use((req, res) => res.sendStatus(404))

app.listen(app.get('port'), app.get('host'), _ => console.log(`Listening on ${app.get('host')}:${app.get('port')}`))
