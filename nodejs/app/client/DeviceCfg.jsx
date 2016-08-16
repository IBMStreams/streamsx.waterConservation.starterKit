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
import { Card, CardHeader, CardText } from 'material-ui/lib/card';
import RaisedButton from 'material-ui/lib/raised-button';
import Download from 'material-ui/lib/svg-icons/file/file-download';

import AppTheme from './style/theme';
import BaseComponent from './common/BaseComponent';
const _ = require('lodash');
const request = require('superagent');

class DeviceCfg extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this._bind('componentDidMount');
    this.state = {
      errmsg: null,
      devicecfg: null
    };
  }

  componentDidMount() {
    const self = this;
    request.get('/api/iot/devicecfg')
      .end(function(err, res) {
        if (err) {
          self.setState({
            errmsg: res.body.message || err.message
          });
        } else if (!_.isEmpty(res.text)) {
          self.setState({
            errmsg: null,
            devicecfg: res.text
          });
        }
      });
  }

  render() {
    const textarea = this.state.errmsg || this.state.devicecfg || 'Updating...';
    const disableButton = _.isEmpty(this.state.devicecfg);
    const appVersion = process.env.npm_package_version;
    const quarkFn = `smartsprinkler.quarks-${appVersion}.jar`;
    const quarkUrl = `https://github.com/IBMStreams/streamsx.waterConservation.starterKit/releases/download/v${appVersion}/${quarkFn}`;

    return (
      <Card>
        <CardHeader title="Device Configuration File" titleColor={AppTheme.cardTitleColor} subtitleColor={AppTheme.cardSubtitleColor} style={{
          backgroundColor: AppTheme.palette.primary2Color
        }} titleStyle={{
          fontSize: 'large'
        }}/>
        <CardText>
          <textarea
            readOnly
            style={{resize: 'none'}}
            id='devicecfg'
            cols={80}
            rows={textarea.split('\n').length}
            value={textarea}
          />
          <br />
          <RaisedButton
            label="Download device.cfg"
            linkButton={true}
            icon={<Download />}
            download="device.cfg"
            href="/api/iot/devicecfg"
            disabled={disableButton}
          />
          <hr/>
          <RaisedButton
            label={`Download ${quarkFn}`}
            linkButton={true}
            icon={<Download />}
            href={quarkUrl}
          />
        </CardText>
      </Card>
    )
  };
}

export default DeviceCfg;
