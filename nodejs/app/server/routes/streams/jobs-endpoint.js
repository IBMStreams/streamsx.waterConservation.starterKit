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

const config = require.main.require('./app/server/config/application');
const streams = require.main.require('./app/server/common/streams-api');
const utils = require.main.require('./app/server/common/utils');
const io = require.main.require('./app/server/routes/socket/io-socket');
const logger = require.main.require('./app/server/common/logger');

// Common streams status to return
const status_in_progress = null;
const status_failed = { job_count: 0 };

// Get Jobs that are currently running
endpt.get('/', function(req, res, next) {
  io.emit('streamjobs', status_in_progress);
  streams.getRunningJobs(config.streaming_analytics, function (err, status) {
    if (err) {
      io.emit('streamjobs', status_failed);
      return next(err);
    }

    io.emit('streamjobs', status);
    res.send(status);
  });
});

// Submit SABs to Streaming Analytics service
endpt.post('/', function(req, res, next) {
  io.emit('streamjobs', status_in_progress);
  streams.deploysab(config.streaming_analytics, config.streaming_app, function (err, status) {
    if (err) {
      io.emit('streamjobs', status_failed);
      return next(err);
    }

    io.emit('streamjobs', status);
    res.send(status);
  });
});

// Delete all jobs that are currently running
endpt.delete('/', function(req, res, next) {
  io.emit('streamjobs', status_in_progress);
  streams.stopJobs(config.streaming_analytics, config.streaming_app, function (err, status) {
    io.emit('streamjobs', status_failed);
    if (err) {
      return next(err);
    }

    res.sendStatus(HttpStatus.NO_CONTENT);
  });
});

module.exports = endpt;
