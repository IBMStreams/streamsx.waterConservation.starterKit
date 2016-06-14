/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
const _ = require('lodash');
const request = require('request');
const HttpStatus = require('http-status-codes');
const async = require('async');
const path = require('path');
const url = require('url');
const fs = require('fs');

const logger = require.main.require('./app/server/common/logger');

// Persistent device config file for the session.
var device_cfg_file = null;

// getIotfAPI() expects the credential to have the following fields:
// {
//   "org": "xxxxxx",
//   "base_uri": "https://xxxxxx.internetofthings.ibmcloud.com:xxx/api/vxxxx",
//   "apiKey": "xxxxx",
//   "apiToken": "xxxxx"
// }
function getIotfApiUrl(credential, path, query) {
  // IOTF docs:
  // https://docs.internetofthings.ibmcloud.com/swagger/v0002.html?cm_mc_uid=43678319775414535003853&cm_mc_sid_50200000=1465224726#/

  const uri = url.parse(credential.base_uri);
  const v2_path = '/api/v0002';
  return url.format({
    auth: credential.apiKey + ':' + credential.apiToken,
    protocol: uri.protocol,
    hostname: uri.hostname,
    port: uri.port,
    pathname: v2_path + path,
    query: query
  });
}

// Handle error from HTTP request
function handleRequestError(err, resp, good_statuscode) {
  if (err) {
    logger.error(err);
    return err;
  }

  if (resp.statusCode !== good_statuscode) {
    err = new Error('Response code: ' + resp.statusCode);
    logger.error(err, resp.body);
    return err;
  }

  return null;
}

function getDeviceTypes(credential, cb) {
  logger.info('Using the IBM Watson IoT Platform API to get list of device types');

  request.get({
    url: getIotfApiUrl(credential, '/device/types'),
    json: true,
  }, function (err, resp, body) {
    err = handleRequestError(err, resp, HttpStatus.OK);
    logger.info('List of Device Types:', body);
    cb(err, body);
  });
}

// Register a new device type, if necessary
function addDeviceType(credential, devicecfg, deviceTypeList, cb) {
  if (_.some(deviceTypeList.results, {
    id: devicecfg.type
  })) {
    // Device Type already exist, not need to add
    return cb(null);
  }

  logger.info('Using the IBM Watson IoT Platform API to register a new device type');

  request.post({
    url: getIotfApiUrl(credential, '/device/types'),
    json: true,
    body: {
      id: devicecfg.type
    }
  }, function (err, resp, body) {
    err = handleRequestError(err, resp, HttpStatus.CREATED);
    cb(err);
  });
}

function getDevice(credential, devicecfg, cb) {
  logger.info('Using the IBM Watson IoT Platform API to get device');

  request.get({
    url: getIotfApiUrl(credential, '/device/types/' + devicecfg.type + '/devices'),
    json: true,
  }, function (err, resp, body) {
    err = handleRequestError(err, resp, HttpStatus.OK);
    logger.info('List of Devices:', body);
    cb(err, body);
  });
}

function deleteDevice(credential, devicecfg, deviceList, cb) {
  if (!_.some(deviceList.results, {
    deviceId: devicecfg.id
  })) {
    // Device ID does not exist, nothing to delete
    return cb(null);
  }

  logger.info('Using the IBM Watson IoT Platform API to delete a registered device');
  request.delete({
    url: getIotfApiUrl(credential, '/device/types/' + devicecfg.type + '/devices/' + devicecfg.id)
  }, function (err, resp) {
    err = handleRequestError(err, resp, HttpStatus.NO_CONTENT);
    cb(err);
  });
}

// Register a new device and return a device configuration file
// suitable for setting up edge devices
function addDevice(credential, devicecfg, cb) {
  logger.info('Using the IBM Watson IoT Platform API to register a new device');

  request.post({
    url: getIotfApiUrl(credential, '/device/types/' + devicecfg.type + '/devices'),
    json: true,
    body: {
      deviceId: devicecfg.id,
      deviceInfo: devicecfg.deviceInfo,
      metadata: devicecfg.metadata,
      authToken: devicecfg.authtoken
    }
  }, function (err, resp, body) {
    err = handleRequestError(err, resp, HttpStatus.CREATED);
    cb(err, body);
  });
}


// Exported APIs

// Register a new device and create Device Config file
// credential: see above
// deviceType: device type name (i.e. sprinkler)
// deviceID: device ID (i.e. sprinkler01)
// deviceAuthToken: authtoken to gain access to device
function createDeviceConfig (credential, devicecfg, done) {
  if (device_cfg_file) {
    logger.info('Device configuration file', device_cfg_file);
    return done(null, device_cfg_file);
  }

  async.waterfall([
    async.apply(getDeviceTypes, credential),
    async.apply(addDeviceType, credential, devicecfg),
    async.apply(getDevice, credential, devicecfg),
    async.apply(deleteDevice, credential, devicecfg),
    async.apply(addDevice, credential, devicecfg),
  ], function (err, result) {
    if (!err) {
      logger.info('Device successfully added.');
    }
    if (done) {
      device_cfg_file = (err || !result) ? null : {
        org: credential.org,
        type: result.typeId,
        id: result.deviceId,
        'auth-method': 'token',
        'auth-token': result.authToken
      };
      logger.info('Device configuration file:', device_cfg_file);
      done(err, device_cfg_file);
    }
  });
}

function getDeviceConfig (done) {
  done(null, device_cfg_file);
}

module.exports = {
  createDeviceConfig: createDeviceConfig,
  getDeviceConfig: getDeviceConfig
};
