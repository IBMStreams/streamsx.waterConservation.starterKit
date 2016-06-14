/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
const logger = require.main.require('./app/server/common/logger');

// Get appropriate settings file base on ${NODE_ENV}
const ENV = process.env.NODE_ENV || 'local';
const configFile = './application-' + ENV;
const config = require(configFile);

logger.info({
  server: config.server
}, 'Reading Configuration file: %s.js', configFile);

module.exports = config;
