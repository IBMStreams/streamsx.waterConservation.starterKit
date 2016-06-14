/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
const package = require.main.require('./package.json');
const bunyan = require('bunyan');
const ENV = process.env.NODE_ENV || 'dev';

var log = bunyan.createLogger({
  name: package.name,
  src: ENV === 'dev', // Display source coordinate (in dev only)
  streams: [
    {
      // Only log fatal messages during unit-test runs
      level: (ENV === 'test') ? 'fatal' : 'trace', // trace, debug, info, warn, error, fatal
      stream: process.stdout
    }
  ]
});

// Hacking logger to suppress some fields
delete log.fields.name;
delete log.fields.hostname;
delete log.fields.pid;

module.exports = log;
