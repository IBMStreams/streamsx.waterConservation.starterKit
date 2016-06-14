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

// In Memory governance state
var governance = {
  water_ban: false
};

// Change governance state
endpt.post('/', function(req, res, next) {
  if (_.isEmpty(req.body)) {
    var err = new Error('Body must not be empty');
    err.status = HttpStatus.BAD_REQUEST;
    return next(err);
  }

  governance = req.body;
  io.emit('governance', governance);
  res.sendStatus(HttpStatus.CREATED);
});

// Get governance state
endpt.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(governance);
});

module.exports = endpt;
