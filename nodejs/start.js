/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
const express = require('express');
const path = require('path');
const HttpStatus = require('http-status-codes');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');

const config = require('./app/server/config/application');
const server = require('./app/server/server');
const logger = require('./app/server/common/logger');
const io = require('./app/server/routes/socket/io-socket');
const streams = require('./app/server/common/streams-api');
const iot = require('./app/server/common/iot-api');

// Setup server initialization logic
const isProduction = process.env.NODE_ENV === 'production';
const port = config.server.port;

// Submit streams application to streams instance
if (!config.streaming_analytics) {
  logger.error('You must bind the streaming-analytics service to this application.');
  process.exit(1);
} else if (config.server.deploysab){
  streams.deploysab(config.streaming_analytics, config.streaming_app, function(err, res) {
    if (err) {
      process.exit(1);
    }
  });
}

// Get device file config
if (!config.iot_platform) {
  logger.error('You must bind the Internet-of-Things-Platform service to this application.');
  process.exit(1);
} else if (config.server.createIotDevice){
  iot.createDeviceConfig(config.iot_platform, config.edge_device, function (err, device_config) {
    if (err) {
      process.exit(1);
    }
  });
}

var staticAssetsPath;
if (isProduction) {
  staticAssetsPath = path.resolve(__dirname, 'dist');
} else {
  staticAssetsPath = path.resolve(__dirname, 'app', 'www');
}

var proxy = httpProxy.createProxyServer();
var app = express();

var appServer;

if (config.server.ssl.enabled) {
  appServer = server.createSSLServer(config, app, function() {
    logger.info('Water Conservation Server (SSL) listening on port %d.', config.server.port);
  });
} else {
  appServer = server.createServer(config, app, function() {
    logger.info('Water Conservation Server listening on port %d.', config.server.port);
  });
}

// parse application/json
app.use(bodyParser.json());

// We point to our static assets
app.use(express.static(staticAssetsPath));

// We only want to run the workflow when not in production
if (!isProduction) {
  // We require the bundler inside the if block because
  // it is only needed in a development environment. Later
  // you will see why this is a good idea
  var bundle = require('./bundle.js');
  bundle();

  // Any requests to localhost:3000/build is proxied
  // to webpack-dev-server
  app.all('/build/*', function(req, res) {
    proxy.web(req, res, {target: 'http://localhost:8080'});
  });
}

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

// Socket listener
io.listen(appServer);

// Other server side endpoints
app.use('/api/weather', require('./app/server/routes/weather/weather-endpoint'));
app.use('/api/streams', require('./app/server/routes/streams/streams-endpoint'));
app.use('/api/iot', require('./app/server/routes/iot/iot-endpoint'));

// Common error handler
app.use(function(err, req, res, next) {
  const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;

  var errorJson = {
    'status': status,
    'originalErr': err,
    'message': err.message
  };

  if (config.server.stacktrace) {
    errorJson.stack = err.stack.split('\n');
  }

  // Log non-HTTP errors to terminal (could be compilation/runtime errors)
  if (!err.status) {
    // Log 500 errors to terminal as well
    console.log(errorJson);
  }

  logger.error({
    body: errorJson
  }, '%s %s failed.', req.method, req.url);
  res.status(status).json(errorJson);
});

function closeServer(done) {
  appServer.close(done);
}

module.exports = {
  closeServer: closeServer
};
