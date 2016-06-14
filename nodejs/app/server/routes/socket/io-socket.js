/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
const io = require('socket.io')();
const request = require('request');
const url = require('url');
const _ = require('lodash');

const config = require.main.require('./app/server/config/application');
const logger = require.main.require('./app/server/common/logger');

// This logic is wholly unnecessary, as anyone who needs to get sensor reading can
// get it from the REST API directly.. but I just wanted to try out the Socket
// conneciton.
function sendSensorReadings(socket) {
  const requestUrl = url.format({protocol: 'http', hostname: 'localhost', port: config.server.port, pathname: '/api/streams/sensorreading'});
  request({
    url: requestUrl,
    method: 'GET',
    json: true
  }, function(err, req, data) {
    if (err) {
      logger.info('Error getting Sensor Reading', err);
      return;
    }

    socket.emit('sensorreading', _.last(data));
  });
}

io.on('connection', function(socket) {
  socket.on('fetchSensorReading', function() {
    sendSensorReadings(socket);
  });
});

module.exports = io;
