/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardActions from 'material-ui/lib/card/card-actions';
import Slider from 'material-ui/lib/slider';
import Toggle from 'material-ui/lib/toggle';

import AppTheme from './style/theme';
import BaseComponent from './common/BaseComponent';
const moment = require('moment');
const request = require('superagent');
const _ = require('lodash');

const temp_bar_max_height = 80; // In pixels
const temp_bar_width = 20; // In pixels

function getIconURL(code) {
  return "images/weathericons/icon" + code + ".png";
}

function formatTemp(temp, units) {
  if (temp === null) {
    return '\u00a0\u00a0---';
  }
  if (units === 'm' || units === 'h') {
    return temp + '\u00b0C';
  } else {
    return temp + '\u00b0F';
  }
}

function calcTempBarDimension(overallmin, overallmax, daymin, daymax) {
  const tempToPixelRatio = (temp_bar_max_height - temp_bar_width) / (overallmax - overallmin);
  if (!daymin) {
    daymin = daymax;
  }
  if (!daymax) {
    daymax = daymin;
  }
  const height = temp_bar_width + ((daymax - daymin) * tempToPixelRatio);
  const top = (overallmax - daymax) * tempToPixelRatio;
  return {height: height, top: top};
}

class DayTiny extends BaseComponent {
  render() {
    const forecast = this.props.forecast;
    const units = this.props.units;
    const day = forecast.day || forecast.night;
    const QPF = 'QPF: ' + forecast.qpf.toFixed(2);

    const day_container = {
      flexGrow: 1,
      textAlign: 'center'
    };

    const day_label = {
      fontWeight: 'bold'
    };

    const qpf_label = {};

    const img_style = {
      width: '40px',
      height: '40px'
    };

    const tempbar = calcTempBarDimension(this.props.mintemp, this.props.maxtemp, forecast.min_temp, forecast.max_temp);
    const temp_bar = {
      height: tempbar.height,
      top: tempbar.top,
      width: temp_bar_width,
      backgroundColor: AppTheme.temperatureBar,
      position: 'relative',
      margin: '18px auto 0',
      borderRadius: '200px'
    };

    const max_temp = {
      position: 'absolute',
      whiteSpace: 'nowrap',
      top: '-18px',
      left: '-2px'
    };

    const min_temp = {
      position: 'absolute',
      whiteSpace: 'nowrap',
      bottom: '-18px',
      left: '-2px'
    };

    // <div style={temp_bar}>
    //   <span style={max_temp}>{formatTemp(forecast.max_temp, units)}</span>
    //   <span style={min_temp}>{formatTemp(forecast.min_temp, units)}</span>
    // </div>

    return (
      <div style={day_container}>
        <div style={day_label}>{day.daypart_name}</div>
        <div style={qpf_label}>{QPF}</div>
        <img style={img_style} src={getIconURL(day.icon_code)}/>
      </div>
    );
  }
}

class DayLarge extends BaseComponent {
  render() {
    const forecast = this.props.forecast;
    const units = this.props.units;
    const day = forecast.day || forecast.night;
    const QPF = 'QPF: ' + day.qpf;
    const date = moment(day.fcst).format('MMM D');

    const container = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // justifyContent: 'center',
      width: '30%'
    };

    const date_style = {
      fontSize: '50%'
    };

    const img_style = {
      position: 'relative',
      display: 'inline-block',
      width: '40px',
      height: '40px'
    };

    const temp_style = {
      position: 'relative',
      display: 'inline-block',
      top: '-20px',
      marginLeft: '5px',
      fontSize: '20px',
      fontWeight: 'bold'
    };

    const narrative_style = {
      textAlign: 'center'
    };
    return (
      <div style={container}>
        <h2>{date}</h2>
        <div>
          <img style={img_style} src={getIconURL(day.icon_code)}/>
          <div style={temp_style}>{formatTemp(day.temp, units)}</div>
        </div>
      </div>
    );

    // <div style={narrative_style}>{day.wind_phrase}</div>
  }
}

class RainSlider extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this._bind('handleChange', 'componentWillReceiveProps');

    this.state = {
      rain_level: this.props.rainy
    };
  }

  handleChange(event, value) {
    this.setState({rain_level: value});
    this.props.forecastChange(value, true);
  }

  componentWillReceiveProps(props) {
    if (this.props.rainy !== props.rainy) {
      this.setState({rain_level: props.rainy});
      this.props.forecastChange(props.rainy);
    }
  }

  render() {
    let container = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    };

    const img_style = {
      width: '50px',
      height: '50px',
      paddingRight: '10px',
      paddingLeft: '10px',
      marginTop: '-28px'
    };

    const zeus_style = {
      width: '100px',
      height: '100px',
      paddingRight: '10px',
      paddingLeft: '10px',
      marginTop: '-28px'
    };

    // Hide the control if simulator is not enabled.
    container.display = this.props.enable
      ? 'flex'
      : 'none';

    return (
      <div style={container}>
        <img style={zeus_style} src="/images/zeus.png"/>
        <img style={img_style} src={getIconURL(40)}/>
        <Slider defaultValue={this.state.rain_level} step={0.1} value={this.state.rain_level} onChange={this.handleChange} style={{
          flexGrow: 1
        }}/>
        <img style={img_style} src={getIconURL(36)}/>
      </div>
    );
  }
}

class DailyForecast extends BaseComponent {
  constructor(props, context) {
    super(props, context);

    this._bind('componentDidMount', 'handleForecastChange', 'updateForecast', 'handleToggleRainSimulator', 'updateSimulationStatus');
    this.state = {
      forecast: null,
      rain_simulator: null
    };
  }

  componentDidMount() {
    const self = this;
    this.socket = io();
    this.socket.on('rainsimulation', function(status) {
      self.updateSimulationStatus();
    });
    self.updateSimulationStatus();
  }

  updateSimulationStatus() {
    const self = this;
    request.get('/api/weather/simulatedforecast/status').end(function(err, res) {
      if (!err) {
        const rain_simulator = res.body;
        self.setState({rain_simulator});
        self.updateForecast(rain_simulator.enable
          ? rain_simulator.rainy
          : null);
      }
    });
  }

  updateForecast(rainy) {
    const self = this;
    if (rainy !== null) {
      request.get('/api/weather/simulatedforecast/daily').end(function(err, res) {
        if (!err) {
          self.setState({forecast: res.body});
        }
      });
    } else {
      request.get('/api/weather/forecast/daily').end(function(err, res) {
        if (!err) {
          self.setState({forecast: res.body});
        }
      });
    }
  }

  // Set broadcast to true, if change needs to be reflected on server
  handleForecastChange(rainy, broadcast) {
    const self = this;
    if (rainy !== null) {
      this.state.rain_simulator.rainy = rainy;
    }
    if (broadcast) {
      request.post('/api/weather/simulatedforecast/status').send(this.state.rain_simulator).end(function(err, res) {
        self.updateForecast(rainy);
      });
    } else {
      self.updateForecast(rainy);
    }
  }

  handleToggleRainSimulator() {
    this.state.rain_simulator.enable = !this.state.rain_simulator.enable

    this.handleForecastChange(this.state.rain_simulator.enable
      ? this.state.rain_simulator.rainy
      : null, true);
  }

  render() {
    const maxday = 7;
    const data = this.state.forecast;
    if (!data) {
      return null;
    }
    const title = maxday + '-day weather forecast';
    const subtitle = 'Last Updated on ' + moment.unix(data.metadata.expire_time_gmt).format('MM/DD/YYYY HH:MM:SS');
    const forecasts = data.forecasts.slice(0, maxday);

    const forecast_container = {
      display: 'flex',
      flexFlow: 'row',
      // height: temp_bar_max_height + 125,
      backgroundColor: AppTheme.forecastBackground,
      fontSize: '14px',
      paddingTop: '5px'
    };

    // Calculate the maximum and minimum temperature over the next few days
    const max_temps = _.map(forecasts, function(entry) {
      return entry.max_temp
        ? entry.max_temp
        : entry.min_temp;
    });
    const min_temps = _.map(forecasts, function(entry) {
      return entry.min_temp
        ? entry.min_temp
        : entry.max_temp;
    });
    const temp_max = _.max(_.concat(max_temps, min_temps));
    const temp_min = _.min(_.concat(max_temps, min_temps));

    const rain_simulator_status_text = this.state.rain_simulator.enable
      ? ''
      : 'Weather God is OFFLINE';

    return (
      <Card>
        <CardHeader title={title} titleColor={AppTheme.cardTitleColor} subtitleColor={AppTheme.cardSubtitleColor} subtitle={subtitle} avatar={getIconURL(36)} style={{
          backgroundColor: AppTheme.palette.primary2Color
        }} titleStyle={{
          fontSize: 'large'
        }}/>
        <div style={forecast_container}>
          <DayLarge forecast={forecasts[0]} units={data.metadata.units}/> {forecasts.map(entry => (<DayTiny key={entry.fcst_valid} forecast={entry} maxtemp={temp_max} mintemp={temp_min} units={data.metadata.units}/>))}
        </div>
        <CardActions style={{
          backgroundColor: AppTheme.cardActionsBackground
        }}>
          <Toggle label={rain_simulator_status_text} toggled={this.state.rain_simulator.enable} onToggle={this.handleToggleRainSimulator} labelPosition="right"/>
          <RainSlider enable={this.state.rain_simulator.enable} rainy={this.state.rain_simulator.rainy} forecastChange={this.handleForecastChange}/>
        </CardActions>
      </Card>
    )
  };
}

export default DailyForecast;
