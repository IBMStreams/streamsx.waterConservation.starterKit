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
const iot = require.main.require('./app/server/common/iot-api');
const utils = require.main.require('./app/server/common/utils');
const logger = require.main.require('./app/server/common/logger');

endpt.get('/devicecfg', function(req, res, next) {
  iot.getDeviceConfig(function (err, device_config) {
    if (err) {
      return next(err);
    }

    if (!config.server.createIotDevice) {
      var errmsg = 'Device Configuration File not created when this application starts.\n';
      errmsg += 'Check the config.server.createIotDevice setting.'
      err = new Error(errmsg);
      err.status = HttpStatus.BAD_REQUEST;
      return next(err);
    }

    // Construct device File
    var cfg = '[device]';
    _.forEach(device_config, function(value, key) {
      cfg += '\n' + key + ' = ' + value;
    });
    cfg += '\nui-host = ' + config.server.ui_host;
    cfg += '\nsimulation = false';

    res.set('Content-Disposition', 'attachment; filename=device.cfg');
    res.set('Content-Type', 'application/octet-stream');
    res.send(cfg);
  });
});

module.exports = endpt;
