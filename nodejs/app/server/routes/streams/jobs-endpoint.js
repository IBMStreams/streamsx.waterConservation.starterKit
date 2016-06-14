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
const logger = require.main.require('./app/server/common/logger');

endpt.get('/', function(req, res, next) {
  streams.getRunningJobs(config.streaming_analytics, function (err, status) {
    if (err) {
      return next(err);
    }

    res.send(status);
  });
});

module.exports = endpt;
