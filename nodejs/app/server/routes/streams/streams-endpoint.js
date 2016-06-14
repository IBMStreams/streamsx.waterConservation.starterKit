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
const endpt = express.Router();
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const async = require('async');
const request = require('request');
const url = require('url');

const logger = require.main.require('./app/server/common/logger');
const utils = require.main.require('./app/server/common/utils');
const config = require.main.require('./app/server/config/application');

endpt.use('/waterrequest', require('./waterrequest-endpoint'));
endpt.use('/sensorreading', require('./sensorreading-endpoint'));
endpt.use('/governance', require('./governance-endpoint'));
endpt.use('/weatherforecast', require('./weatherforecast-endpoint'));
endpt.use('/jobs', require('./jobs-endpoint'));

// Endpoint for testing above
const sensorReadings = [
  {
    "sprinkler_on": true,
    "moisture": 200
  }, {
    "sprinkler_on": true,
    "moisture": 444
  }, {
    "sprinkler_on": false,
    "moisture": 655
  }, {
    "sprinkler_on": false,
    "moisture": 836
  }, {
    "sprinkler_on": false,
    "moisture": 733
  }, {
    "sprinkler_on": false,
    "moisture": 565
  }, {
    "sprinkler_on": true,
    "moisture": 123
  }, {
    "sprinkler_on": true,
    "moisture": 205
  }, {
    "sprinkler_on": false,
    "moisture": 303
  }, {
    "sprinkler_on": false,
    "moisture": 353
  }
];

endpt.post('/init', function(req, res, next) {
  async.each(sensorReadings, function(entry, cb) {
    const requestUrl = url.format({protocol: 'http', hostname: 'localhost', port: config.server.port, pathname: '/api/streams/sensorreading'});
    request.post({
      url: requestUrl,
      body: entry,
      json: true
    }, function(err, req, data) {
      cb();
    });
  }, function(err) {
    res.sendStatus(HttpStatus.CREATED);
  });
});

module.exports = endpt;
