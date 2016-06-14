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

const logger = require.main.require('./app/server/common/logger');
const utils = require.main.require('./app/server/common/utils');
const io = require.main.require('./app/server/routes/socket/io-socket');

// In Memory weatherforecast (keep tracks of 100 most recent entries)
var forecasts = [];

// Post one weather forecast entry
endpt.post('/', function(req, res, next) {
  if (_.isEmpty(req.body)) {
    var err = new Error('Body must not be empty');
    err.status = HttpStatus.BAD_REQUEST;
    return next(err);
  }

  // Save the weather forecast entry to memory
  var forecast = req.body;
  if (forecasts.length === 100) {
    forecasts.shift();
  }
  forecasts.push(forecast);
  io.emit('weatherforecast', forecast);

  res.sendStatus(HttpStatus.CREATED);
});

// Get weather forecasts entries
endpt.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(forecasts);
});

module.exports = endpt;
