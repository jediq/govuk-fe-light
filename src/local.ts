'use strict';
var logger = require('./util/Logger')
var app = require('./app')
var port = 3000

app.listen(port)
logger.info(`listening on : http://localhost:${port}`)
