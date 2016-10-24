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
import { Card, CardHeader, CardActions } from 'material-ui/lib/card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';

import RaisedButton from 'material-ui/lib/raised-button';
import Refresh from 'material-ui/lib/svg-icons/navigation/refresh';
import Report from 'material-ui/lib/svg-icons/content/report';
import Publish from 'material-ui/lib/svg-icons/editor/publish';

import AppTheme from './style/theme';
import BaseComponent from './common/BaseComponent';
const _ = require('lodash');
const request = require('superagent');

class StreamJobs extends BaseComponent {
  constructor(props, context) {
    super(props, context);

    this._bind('componentDidMount', 'refreshJobStatus', 'stopJobs', 'submitJobs');
    this.state = {
      disableActions: false,
      jobStatus: {}
    };
  }

  refreshJobStatus() {
    const self = this;
    self.setState({
      disableActions: true,
      jobStatus: {}
    });
    request.get('/api/streams/jobs')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (!err && !_.isEmpty(res.body)) {
          self.setState({
            disableActions: false,
            jobStatus: res.body
          });
        }
      });
  }

  stopJobs() {
    const self = this;
    self.setState({
      disableActions: true,
    });
    request.delete('/api/streams/jobs')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (!err) {
          self.setState({
            disableActions: false,
            jobStatus: {}
          });
        }
      });
  }

  submitJobs() {
    const self = this;
    self.setState({
      disableActions: true,
    });
    request.post('/api/streams/jobs')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (!err && !_.isEmpty(res.body)) {
          self.setState({
            disableActions: false,
            jobStatus: res.body
          });
        }
      });
  }

  componentDidMount() {
    this.refreshJobStatus();
  }

  render() {
    const refreshText = this.state.disableActions ? 'Updating..' : 'Refresh Status';
    const refreshDisable = this.state.disableActions;

    let status = [];
    if (!_.isEmpty(this.state.jobStatus)) {
      _.map(this.state.jobStatus.jobs, (job) => {
        status.push(
          <TableRow key={job.jobId}>
            <TableRowColumn>{job.application}</TableRowColumn>
            <TableRowColumn>{job.jobId}</TableRowColumn>
            <TableRowColumn>{job.health}</TableRowColumn>
          </TableRow>);
      });
    }

    const jobButtonText = _.isEmpty(status) ? 'Submit Jobs' : 'Stop Jobs';
    const jobButtonIcon = _.isEmpty(status) ? (<Publish />) : (<Report />);
    const jobButtonAction = _.isEmpty(status) ? this.submitJobs : this.stopJobs;

    return (
      <Card>
        <CardHeader
          title="Streams Analytics Status"
          titleColor={AppTheme.cardTitleColor} subtitleColor={AppTheme.cardSubtitleColor}
          style={{
            backgroundColor: AppTheme.palette.primary2Color
          }}
          titleStyle={{
            fontSize: 'large'
          }}
        />

        <Table selectable={false}>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Application</TableHeaderColumn>
              <TableHeaderColumn>Job ID</TableHeaderColumn>
              <TableHeaderColumn>Health</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {status}
          </TableBody>
        </Table>

        <CardActions>
          <RaisedButton
            label={refreshText}
            disabled={refreshDisable}
            icon={<Refresh />}
            onMouseDown={this.refreshJobStatus}
          />
          <RaisedButton
            label={jobButtonText}
            icon={jobButtonIcon}
            disabled={refreshDisable}
            onMouseDown={jobButtonAction}
          />
        </CardActions>
      </Card>
    )
  };
}

export default StreamJobs;
