/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
const path = require('path');

// To deploy the application locally, there are a few places in this file
// you will need to customize.  Grep for 'FILL IN' to locate these places

const server = {
  port: 3000,
  ssl: {
    enabled: false,
    protocol: 'TLS',
    key: 'private.key',
    certificate: 'public.cert'
  },
  stacktrace: true,

  // Deploy Streaming Analytic SAB file?
  // If true, check if the 'streaming_app' settings are correct
  deploysab: false,

  // Create IOT Device configuration?
  // If true, check if 'edge_device' settings are correct
  createIotDevice: false,

  // Externally available host where water request and water sensor
  // endpoint reside  (This is used by the quarks and streams application,
  // and therefore must be a publicly available URL)
  ui_host: 'http://xxx.mybluemix.net'
};

// FILL IN with your weather service bluemix credential
const weather = {
  "username": "xxx",
  "password": "xxx",
  "host": "xxx",
  "port": 443,
  "url": "xxx"
};

// FILL IN with your Streaming Analytic bluemix credential
const streaming_analytics = {
  "password": "xxx",
  "rest_port": "443",
  "bundles_path": "xxx",
  "statistics_path": "xxx",
  "resources_path": "xxx",
  "stop_path": "xxx",
  "rest_host": "xxx",
  "jobs_path": "xxx",
  "start_path": "xxx",
  "rest_url": "xxx",
  "userid": "xxx",
  "status_path": "xxx"
};

// FILL IN with your IOT bluemix credential
const iot_platform = {
  "iotCredentialsIdentifier": "xxx",
  "mqtt_host": "xxx",
  "mqtt_u_port": 1883,
  "mqtt_s_port": 8883,
  "base_uri": "xxx",
  "http_host": "xxx",
  "org": "xxx",
  "apiKey": "xxx",
  "apiToken": "xxx"
};

const streaming_app = [{
  name: 'com.ibm.streamsx.iot.watson.apps::IotPlatform',
  file: path.resolve('streamsapp', 'com.ibm.streamsx.iot.watson.apps.IotPlatform.sab'),
  submit_config: {
    configurationSettings: {},
    submissionParameters: {
      'IotPlatform.org': iot_platform.org,
      'IotPlatform.authKey': iot_platform.apiKey,
      'IotPlatform.authToken': iot_platform.apiToken
    }
  }
},{
  name: 'com.ibm.streamsx.smartsprinkler.streams::DecisionMaker',
  file: path.resolve('streamsapp', 'com.ibm.streamsx.smartsprinkler.streams.DecisionMaker.sab'),
  submit_config: {
    configurationSettings: {},
    submissionParameters: {
      // FILL IN with host where the app is deployed in external site
      // This is necessary because the stream application cannot contact the application
      // running on localhost
      'DecisionMaker.host': server.ui_host,
      'DecisionMaker.weather_url': 'https://' + weather.host + ':' + weather.port,
      'DecisionMaker.weather_user': weather.username,
      'DecisionMaker.weather_pw': weather.password,
    }
  }
},{
  name: 'com.ibm.streamsx.smartsprinkler.iot::IotSensorCommands',
  file: path.resolve('streamsapp', 'com.ibm.streamsx.smartsprinkler.iot.IotSensorCommands.sab'),
  submit_config: {
    configurationSettings: {}
  }
},{
  name: 'com.ibm.streamsx.smartsprinkler.iot::IotSensorEvents',
  file: path.resolve('streamsapp', 'com.ibm.streamsx.smartsprinkler.iot.IotSensorEvents.sab'),
  submit_config: {
    configurationSettings: {}
  }
}];

// Settings for registerting edge device on IOT platform
// FILL IN, change any information necessary to setup the edge device
const edge_device = {
  type: 'iotSprinkler',
  id: 'rPiSprinkler1',
  authtoken: 'streamers',
  // optional meta information
  metadata: {},
  deviceInfo: {}
};

module.exports = {
  server: server,
  streaming_app: streaming_app,
  edge_device: edge_device,
  weather: weather,
  streaming_analytics: streaming_analytics,
  iot_platform: iot_platform
};
