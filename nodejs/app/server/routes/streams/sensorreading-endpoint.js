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

// In Memory sensor readings (keep tracks of 100 most recent entries)
var sensorReadings = [];

// Post one sensor reading entry
endpt.post('/', function(req, res, next) {
  if (_.isEmpty(req.body)) {
    var err = new Error('Body must not be empty');
    err.status = HttpStatus.BAD_REQUEST;
    return next(err);
  }

  // Save the sensor reading entry to memory
  var sensor_reading = req.body;
  if (sensorReadings.length === 100) {
    sensorReadings.shift();
  }
  sensorReadings.push(sensor_reading);
  io.emit('sensorreading', sensor_reading);

  res.sendStatus(HttpStatus.CREATED);
});

// Get Sensor readings
endpt.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(sensorReadings);
});

module.exports = endpt;
