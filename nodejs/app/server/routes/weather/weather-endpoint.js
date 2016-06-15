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
const url = require('url');
const request = require('request');
const moment = require('moment');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const config = require.main.require('./app/server/config/application');
const utils = require.main.require('./app/server/common/utils');
const io = require.main.require('./app/server/routes/socket/io-socket');
const logger = require.main.require('./app/server/common/logger');

const markham_geocode = "43.85,-79.34";

function weatherAPI(path, queries, cb) {
  request({
    url: url.resolve(config.weather.url, path),
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Accept": "application/json"
    },
    qs: queries
  }, function(err, req, data) {
    if (err) {
      return cb(err);
    }

    cb(null, utils.parseJSON(data));
  });
}

// Keep track of results so we don't call the weather API more than once a day
var last_daily_result = null;
var last_retrieved_time = null;
var simulation_status = {
  enable: false,
  rainy: 1.0         // default to sunny weather (0.0: rainy, 1.0: sunny)
};
const max_qpf = 5.0;

function getRealWeatherDaily(query, cb) {
  const datefmt = 'MM-DD';
  if (!last_retrieved_time) {
    last_retrieved_time = moment().format(datefmt);
  }
  const now = moment().format(datefmt);

  if (last_retrieved_time !== now || !last_daily_result) {
    weatherAPI("/api/weather/v2/forecast/daily/10day", {
      geocode: query.geocode || markham_geocode,
      units: query.units || "m",
      language: query.language || "en"
    }, function(err, result) {
      if (err) {
        return cb(err);
      }

      if (!result || !result.forecasts || result.forecasts.length === 0) {
        const errmsg = 'Mal-formed Forecast data retrieved.';
        logger.error({weather: result}, 'Mal-formed Forecast data retrieved.');
        return cb(new Error(errmsg));
      }

      last_daily_result = _.cloneDeep(result);
      return cb(null, last_daily_result);
    });
  } else {
    cb(null, last_daily_result);
  }
}

function getIconCode(rainy) {
  if (rainy >= 0 && rainy < 0.2) {
    return 40;
  } else if (rainy >= 0.2 && rainy < 0.4) {
    return 39;
  } else if (rainy >= 0.4 && rainy < 0.6) {
    return 37;
  } else if (rainy >= 0.6 && rainy < 0.8) {
    return 34;
  } else {
    return 36;
  }
}

function modifyOneDay(entry, rainy) {
  entry.qpf = max_qpf - (rainy * max_qpf);
  if (entry.day) {
    entry.day.icon_code = getIconCode(rainy);
  }
  if (entry.night) {
    entry.night.icon_code = getIconCode(rainy);
  }
}

function getSimulateWeather(weather, rainy) {
  var result = _.cloneDeep(weather);

  _.forEach(result.forecasts, function(entry) {
    modifyOneDay(entry, rainy);
  });

  // Make the current weather with a little rain
  modifyOneDay(result.forecasts[0], 0.9);

  return result;
}

// Endpoint for recording weather simulation state
// To disable simulation, make req.body.enable = false
endpt.post('/simulatedforecast/status', function(req, res, next) {
  simulation_status = req.body;
  io.emit('rainsimulation', simulation_status);
  res.sendStatus(HttpStatus.CREATED);
});

endpt.get('/simulatedforecast/status', function(req, res, next) {
  res.send(simulation_status);
});

// Get current simulated forecast if exists (null if not simulated)
endpt.get('/simulatedforecast/daily', function(req, res, next) {
  if (!simulation_status.enable) {
    return res.send(null);
  }

  getRealWeatherDaily(req.query, function(err, result) {
    if (err) {
      return next(err);
    }
    const simulated_daily = getSimulateWeather(result, simulation_status.rainy);
    res.send(simulated_daily);
  });
});

endpt.get('/forecast/daily', function(req, res, next) {
  getRealWeatherDaily(req.query, function(err, result) {
    if (err) {
      return next(err);
    }
    res.send(result);
  });
});

endpt.get('/forecast/hourly', function(req, res, next) {
  weatherAPI("/api/weather/v2/forecast/hourly/24hour", {
    geocode: req.query.geocode || markham_geocode,
    units: req.query.units || "m",
    language: req.query.language || "en"
  }, function(err, result) {
    if (err) {
      return next(err);
    }

    res.send(result);
  });
});

module.exports = endpt;
