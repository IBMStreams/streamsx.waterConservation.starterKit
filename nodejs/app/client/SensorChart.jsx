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
import CardActions from 'material-ui/lib/card/card-actions';
import Avatar from 'material-ui/lib/avatar';
import Toggle from 'material-ui/lib/toggle';
import Snackbar from 'material-ui/lib/snackbar';

import Line from 'react-chartjs/lib/line';

import AppTheme from './style/theme';
import BaseComponent from './common/BaseComponent';
import Gauge from './Gauge';
const _ = require('lodash');
const moment = require('moment');
const request = require('superagent');

const moistureLoThreshold = 10;
const moistureHiThreshold = 70;

const columnFmt = 'HH:mm:ss';
const columnsToDisplay = 30;
const columnScale = 1;
const columnScaleUnit = 'seconds';

function moistureToPercentage(val) {
  const maxMoistureLevel = 1000;
  return parseFloat((val / maxMoistureLevel * 100).toFixed(2));
}

let global_datelabels;
function mapTimestampToDateLabel(timestamp) {
  let label;
  if (timestamp) {
    label = moment(timestamp).format(columnFmt);
  } else {
    label = _.last(global_datelabels);
  }
  return label;
}

function addWaterRequest(waterrequestevent) {
  if (waterrequestevent) {
    const label = mapTimestampToDateLabel(waterrequestevent.timestamp);
    if (!window.chartevent[label]) {
      window.chartevent[label] = {};
    }
    window.chartevent[label]['water_request'] = waterrequestevent;
    window.chartevent[label]['qpf'] = waterrequestevent.qpf;
  }
}

function addForecast(forecastentry) {
  if (forecastentry) {
    const label = mapTimestampToDateLabel(forecastentry.timestamp);
    if (!window.chartevent[label]) {
      window.chartevent[label] = {};
    }
    window.chartevent[label]['qpf'] = forecastentry.qpf;
  }
}

function addEvent(waterrequestevent, forecastentry, datasetlabel) {
  addForecast(forecastentry);
  addWaterRequest(waterrequestevent);
}

function generateEvents(datasetLabels) {
  window.chartevent = {};
  const water_request = null;
  const forecast = null;
  _.forEach(datasetLabels, _.partial(addEvent, water_request, forecast));
  return window.chartevent;
}

function generateToolTip() {
  let tooltip = [];

  // Hacky: look for dataset labels and replace content with custom information
  // datasetLabel: datasets.label
  // label: x-axis column labels
  // value: y-axis value
  tooltip.push('<% if (datasetLabel === "Minimum Moisture") { %>');
  tooltip.push('  <% if (chartevent[label] && chartevent[label].qpf) { %>');
  tooltip.push('    QPF: <%= chartevent[label].qpf %>');
  tooltip.push('  <% } else { %>');
  tooltip.push('    QPF: --');
  tooltip.push('  <% } %>');
  tooltip.push('<% } else if (datasetLabel === "Maximum Moisture") { %>');
  tooltip.push('  <% if (chartevent[label] && chartevent[label].water_request) { %>');
  tooltip.push('    <% var wrequest = chartevent[label].water_request; %>');
  tooltip.push('    <% if (wrequest.approval) { %>');
  tooltip.push('      Water Request Approved: <%= wrequest.reason %>');
  tooltip.push('    <% } else { %>');
  tooltip.push('      Water Request Rejected: <%= wrequest.reason %>');
  tooltip.push('    <% } %>');
  tooltip.push('  <% } else { %>');
  tooltip.push('    No Water Request');
  tooltip.push('  <% } %>');
  tooltip.push('<% } else if (datasetLabel.startsWith("Sprinkler")) { %>');
  tooltip.push('  <%= datasetLabel %>');
  tooltip.push('<% } else if (datasetLabel.startsWith("Watering Event")) { %>');
  tooltip.push('  <%= datasetLabel %>');
  tooltip.push('<% } else { %>');
  tooltip.push('  <%= datasetLabel %>: <%= value %>%');
  tooltip.push('<% } %>');

  return _.join(_.map(tooltip, _.trim), '');
}

const chartOptions = {
  responsive: true,
  animation: false,
  // animationEasing: "easeOutQuart",

  ///Boolean - Whether grid lines are shown across the chart
  scaleShowGridLines: true,

  //String - Colour of the grid lines
  scaleGridLineColor: "rgba(0,0,0,.05)",

  //Number - Width of the grid lines
  scaleGridLineWidth: 1,

  //Boolean - Whether to show horizontal lines (except X axis)
  scaleShowHorizontalLines: true,

  //Boolean - Whether to show vertical lines (except Y axis)
  scaleShowVerticalLines: true,

  //Boolean - Whether the line is curved between points
  bezierCurve: true,

  //Number - Tension of the bezier curve between points
  bezierCurveTension: 0.4,

  //Boolean - Whether to show a dot for each point
  pointDot: true,

  //Number - Radius of each point dot in pixels
  pointDotRadius: 5,

  //Number - Pixel width of point dot stroke
  pointDotStrokeWidth: 7,

  //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
  pointHitDetectionRadius: 10,

  //Boolean - Whether to show a stroke for datasets
  datasetStroke: true,

  //Number - Pixel width of dataset stroke
  datasetStrokeWidth: 2,

  //Boolean - Whether to fill the dataset with a colour
  datasetFill: false,

  // multiTooltipTemplate: "<%= datasetLabel %> - <%= label %> - <%= value %>"
  multiTooltipTemplate: generateToolTip()

};

function initDateLabels() {
  let labels = [];
  let time = moment().subtract((columnsToDisplay - 1) * columnScale, columnScaleUnit);
  for (let i = 0; i < columnsToDisplay; i++) {
    labels.push(time.format(columnFmt));
    time.add(columnScale, columnScaleUnit);
  }

  generateEvents(labels);
  return labels;
}

function generateMoistureLine(val) {
  return _.fill(Array(columnsToDisplay), val);
}

function prepareAddDataEntry(state) {
  let mdata = state.moistureData;
  let ondata = state.sprinklerOnData;
  let offdata = state.waterEventData;

  mdata.shift();
  ondata.shift();
  offdata.shift();
  mdata.push(null);
  ondata.push(null);
  offdata.push(null);

  let dates = state.dateLabels;
  let time = moment(_.last(dates), columnFmt);
  time.add(columnScale, columnScaleUnit);
  dates.shift();
  dates.push(time.format(columnFmt));

  return mdata.length - 1;
}

class WaterBan extends BaseComponent {
  constructor(props, context) {
    super(props, context);

    this._bind('componentDidMount', 'handleToggle');
    this.state = {
      water_ban: false
    };
  }

  componentDidMount() {
    const self = this;
    this.socket = io();
    this.socket.on('governance', function(status) {
      self.setState({water_ban: status.water_ban});
    });
    request.get('/api/streams/governance').end(function(err, res) {
      if (!err) {
        self.setState({water_ban: res.body.water_ban});
      }
    });
  }

  handleToggle(event, val) {
    request.post('/api/streams/governance').send({water_ban: val}).end(function(err, res) {
      // intentional blank.
    });
  }

  render() {
    const water_ban_status = this.state.water_ban
      ? 'Water Ban IS in effect'
      : 'Water Ban IS NOT in effect';

    return (
      <div>
        <Toggle label={water_ban_status} toggled={this.state.water_ban} onToggle={this.handleToggle} labelPosition="right"/>
      </div>
    );
  }
}

class SensorChart extends BaseComponent {
  constructor(props, context) {
    super(props, context);

    this._bind('componentDidMount', 'componentWillUnmount', 'handleSnackbarClose', 'addMoistureData');
    this.state = {
      dateLabels: initDateLabels(),
      moistureData: _.fill(Array(columnsToDisplay), null),
      sprinklerOnData: _.fill(Array(columnsToDisplay), null),
      waterEventData: _.fill(Array(columnsToDisplay), null),
      waterEventMsg: null,
      snackBarOpen: false
    };
    global_datelabels = this.state.dateLabels;
  }

  addMoistureData(status) {
    const idx = prepareAddDataEntry(this.state);
    const moisture = moistureToPercentage(status.moisture);

    this.state.moistureData[idx] = moisture;
    if (status.sprinkler_on) {
      this.state.sprinklerOnData[idx] = moisture;
    }
    this.setState(this.state);
  }

  componentDidMount() {
    const self = this;
    this.socket = io();
    this.socket.on('sensorreading', function(status) {
      self.addMoistureData(status);
    });
    this.socket.on('weatherforecast', function(forecastentry) {
      addForecast(forecastentry);
    });
    this.socket.on('waterrequest', function(entry) {
      addWaterRequest(entry);

      // Display the most recent waterrequest
      const approval_msg = 'Water Approval ' + (entry.approval
        ? 'Approved'
        : 'Rejected');
      self.setState({
        snackbarOpen: true,
        waterEventMsg: approval_msg + ': ' + entry.reason
      });

      // A hack for plotting event data on the graph
      const idx = self.state.waterEventData.length - 1;
      self.state.waterEventData[idx] = self.state.moistureData[idx];
    });
    request.get('/api/streams/weatherforecast').end(function(err, res) {
      if (!err) {
        _.forEach(_.takeRight(res.body, columnsToDisplay), addForecast);
      }
    });
    request.get('/api/streams/waterrequest').end(function(err, res) {
      if (!err) {
        _.forEach(_.takeRight(res.body, columnsToDisplay), addWaterRequest);
      }
    });
    request.get('/api/streams/sensorreading').end(function(err, res) {
      if (!err) {
        _.forEach(_.takeRight(res.body, columnsToDisplay), self.addMoistureData);
      }
    });
  }

  handleSnackbarClose() {
    this.setState({snackbarOpen: false});
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    const non_color = 'rgba(0,0,0,0)';
    const moisture_color = AppTheme.moistureLineColor;
    const on_color = AppTheme.sprinklerOnColor;
    const event_color = AppTheme.waterEventColor;

    let chartData = {
      labels: this.state.dateLabels,
      datasets: [
        {
          label: "Minimum Moisture",
          strokeColor: AppTheme.moistureLoThresholdColor,
          pointColor: non_color,
          pointStrokeColor: non_color,
          data: generateMoistureLine(moistureLoThreshold)
        }, {
          label: "Maximum Moisture",
          strokeColor: AppTheme.moistureHiThresholdColor,
          pointColor: non_color,
          pointStrokeColor: non_color,
          data: generateMoistureLine(moistureHiThreshold)
        }, {
          label: "Moisture",
          fillColor: non_color,
          strokeColor: moisture_color,
          pointColor: non_color,
          pointStrokeColor: non_color,
          pointHighlightFill: non_color,
          pointHighlightStroke: non_color,
          data: this.state.moistureData
        }, {
          label: "Sprinkler On",
          strokeColor: non_color,
          pointColor: on_color,
          pointStrokeColor: non_color,
          pointHighlightFill: on_color,
          pointHighlightStroke: on_color,
          data: this.state.sprinklerOnData
        }, {
          label: "Water Request Event",
          strokeColor: non_color,
          pointColor: event_color,
          pointStrokeColor: non_color,
          pointHighlightFill: event_color,
          pointHighlightStroke: event_color,
          data: this.state.waterEventData
        }
      ]
    };

    const currentMoistureLevelIdx = _.findLastIndex(this.state.moistureData, function(entry) {
      return entry !== null
    });
    const currentMoistureLevel = currentMoistureLevelIdx !== -1
      ? this.state.moistureData[currentMoistureLevelIdx]
      : 0;

    return (
      <Card>
        <CardActions style={{
          backgroundColor: AppTheme.cardActionsBackground
        }}>
          <WaterBan/>
        </CardActions>
        <div style={{
          display: 'flex',
          flexFlow: 'row',
          alignItems: 'center',
          backgroundColor: AppTheme.cardBackground
        }}>
          <div style={{
            flexGrow: 1
          }}>
            <Gauge value={currentMoistureLevel} label="Current Moisture Level"/>
          </div>
          <div style={{
            margin: '20',
            flexGrow: 100
          }}>
            <Line data={chartData} options={chartOptions} height="70" redraw/>
          </div>
        </div>
        <Snackbar open={this.state.snackbarOpen} message={this.state.waterEventMsg} autoHideDuration={20000} onRequestClose={this.handleSnackbarClose}/>
      </Card>
    )
  };
}

export default SensorChart;
