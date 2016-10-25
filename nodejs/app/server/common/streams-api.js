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

// getStreamsAPI() expects the credential to have the following fields:
// {
//   "rest_host": "xxx",
//   "rest_url": "xxx",
//   "rest_port": "0",
//   "userid": "xxx",
//   "password": "xxx",
//   "bundles_path": "xxx",
//   "statistics_path": "xxx",
//   "resources_path": "xxx",
//   "stop_path": "xxx",
//   "jobs_path": "xxx",
//   "start_path": "xxx",
//   "status_path": "xxx"
// }
function getStreamsApiUrl(credential, path, query) {
  return url.format({
    auth: credential.userid + ':' + credential.password,
    protocol: url.parse(credential.rest_url).protocol,
    hostname: credential.rest_host,
    port: credential.rest_port,
    pathname: credential[path],
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

function getInstanceStatus(credential, cb) {
  logger.info('Using the Streaming Analytics REST API to get the instance status');
  request.get({
    url: getStreamsApiUrl(credential, 'jobs_path'),
    json: true,
  }, function (err, resp, body) {
    err = handleRequestError(err, resp, HttpStatus.OK);
    if (!err) {
      logger.info('instance data retrieved successfullly', body);
    }
    cb(err, body);
  });
}

function startInstance(credential, cb) {
  getInstanceStatus(credential, function (err, status) {
    if (!err && status.state === 'STARTED') {
      return cb(null, status);
    }

    logger.info('Using the Streaming Analytics REST API to start a Streams instance');
    request.put({
      url: getStreamsApiUrl(credential, 'start_path'),
      json: true,
      body: {}
    }, function (err, resp, body) {
      err = handleRequestError(err, resp, HttpStatus.OK);
      if (err) {
        return cb(err, status);
      }
      getInstanceStatus(credential, cb);
    });
  });
}

function removeRunningJobs(credential, apps, status, cb) {
  if (status.state !== 'STARTED') {
    return cb(new Error('Streams Instance not started'), null);
  }

  async.each(status.jobs, function(job, callback) {
    if (!_.some(apps, { 'name': job.application })) {
      // Not the same application, don't delete
      return callback(null);
    }
    logger.info('Using the Streaming Analytics REST API to remove job ID: ' + job.jobId);

    request.delete({
      url: getStreamsApiUrl(credential, 'jobs_path', { job_id: job.jobId }),
      json: true
    }, function (err, resp, body) {
      err = handleRequestError(err, resp, HttpStatus.OK);
      callback(err);
    });
  }, function (err) {
    cb(err);
  });
}

function submitJob(credential, apps, cb) {
  var jobStatus = {
    job_count: 0,
    jobs: []
  };
  async.each(apps, function(app, callback) {
    logger.info(
      'Using the Streaming Analytics REST API to submit an application bundle: ' +
      path.basename(app.file));

    request.post({
      url: getStreamsApiUrl(credential, 'jobs_path', { bundle_id: path.basename(app.file) }),
      json: true,
      formData: {
        file: fs.createReadStream(app.file),
        config: {
          value: JSON.stringify(app.submit_config),
          options: {
            contentType: 'application/json'
          }
        }
      }
    }, function (err, resp, body) {
      err = handleRequestError(err, resp, HttpStatus.OK);
      jobStatus.job_count += 1;
      jobStatus.jobs.push({
        jobId: body.jobId,
        application: path.basename(app.file),
        health: 'just started'
      });
      callback(err, body);
    });
  }, function (err) {
    cb(err, jobStatus);
  });
}

// Exported APIs

// submit .sab file to streaming instance
// credential: see above
// apps: is an array of app, each app is expected to have the following fields:
// {
//   name: 'namespace::composite',                  // name of application to submit
//   file: path.resolve('streamsapp', 'xxx.sab'),   // location of sab file
//   submit_config: { }                             // submission configurations
// }
function deploysab (credential, apps, done) {
  async.waterfall([
    async.apply(startInstance, credential),
    async.apply(removeRunningJobs, credential, apps),
    async.apply(submitJob, credential, apps)
  ], function (err, result) {
    if (!err) {
      logger.info('Application bundle(s) successfully submitted');
    }
    if (done) {
      done(err, result);
    }
  });
}

function stopJobs (credential, apps, done) {
  async.waterfall([
    async.apply(startInstance, credential),
    async.apply(removeRunningJobs, credential, apps)
  ], function (err) {
    if (!err) {
      logger.info('Application bundle(s) successfully stopped');
    }
    if (done) {
      done(err);
    }
  });
}

function getRunningJobs (credential, done) {
  request.get({
    url: getStreamsApiUrl(credential, 'jobs_path'),
    json: true,
  }, function (err, resp, body) {
    err = handleRequestError(err, resp, HttpStatus.OK);
    done(err, body);
  });
}

module.exports = {
  deploysab: deploysab,
  stopJobs: stopJobs,
  getRunningJobs: getRunningJobs
};
