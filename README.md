# cc-encoding-api

HTTP API for Colored Coins `OP_RETURN` instructions encoding.

### Install

```
$ npm install -g cc-encoding-api
```

### Use

Running the web server:

```bash
$ PORT=7080 cc-encoding-api

Running on port 7080.
```

#### `POST /encode`

```bash
$ curl -X POST -H 'Content-Type: application/json' \
       -d '[{"skip":false,"range":false,"percent":false,"output":0,"amount":5}]' \
       -s localhost:7080/encode | hexdump -C

00000000  43 43 02 00 05                                    |CC...|
00000005
```

#### `POST /decode`

```bash
$ curl -X POST -d 'hex=43 43 02 00 05' -s localhost:7080/decode 

[{"skip":false,"range":false,"percent":false,"output":0,"amount":5}]
```

### License

https://github.com/Colu-platform/colu-nodejs/blob/master/LICENSE
