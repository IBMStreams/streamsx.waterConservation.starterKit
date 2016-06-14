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

const utils = require.main.require('./app/server/common/utils');

// This assumes the production server is deployed on bluemix
var vcap_services;
if (process.env.VCAP_SERVICES) {
  vcap_services = utils.parseJSON(process.env.VCAP_SERVICES);
}

var vcap_application;
if (process.env.VCAP_APPLICATION) {
  vcap_application = utils.parseJSON(process.env.VCAP_APPLICATION);
  console.dir(vcap_application);
}

const server = {
  port: vcap_application.port,
  ssl: {
    enabled: false,
    protocol: 'TLS',
    key: 'private.key',
    certificate: 'public.cert'
  },
  stacktrace: false,
  deploysab: true,
  createIotDevice: true,
  ui_host: 'http://' + vcap_application.uris[0]
};

const weather = vcap_services.weatherinsights[0].credentials;

const streaming_analytics = vcap_services['streaming-analytics'][0].credentials;

const iot_platform = vcap_services['iotf-service'][0].credentials;

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
const edge_device = {
  type: 'iotSprinkler',
  id: 'rPiSprinkler1',
  authtoken: 'streamers',
  // optional metadata
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
