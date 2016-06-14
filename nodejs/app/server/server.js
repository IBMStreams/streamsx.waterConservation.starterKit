/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
const fs = require('fs');
const http = require('http');
const https = require('https');

function setup(ssl) {
  // Setup global agent for all future https requests
  https.globalAgent = new https.Agent({
    ca: [fs.readFileSync(ssl.certificate)],
    checkServerIdentity: function(host, cert) {
      // Bypass server hostname check
      return undefined;
    }
  });

  return {
    key: fs.readFileSync(ssl.key),
    cert: fs.readFileSync(ssl.certificate)
  };
}

function start(app, options) {
  if (options) {
    return https.createServer(options, app);
  } else {
    return http.createServer(app);
  }
}

function createServer(config, app, cb) {
  return start(app).listen(config.server.port, cb);
}

function createSSLServer(config, app, cb) {
  var options = setup(config.server.ssl);
  return start(app, options).listen(config.server.port, cb);
}

module.exports = {
  createServer: createServer,
  createSSLServer: createSSLServer
};
