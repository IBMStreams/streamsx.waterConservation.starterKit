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

import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';

import BaseComponent from './common/BaseComponent';
import Dashboard from './Dashboard';
import Settings from './Settings';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import AppTheme from './style/theme';

import {red500, yellow200, greenA200} from 'material-ui/lib/styles/colors';
import IconButton from 'material-ui/lib/icon-button';
import MoodGood from 'material-ui/lib/svg-icons/social/mood';
import MoodBad from 'material-ui/lib/svg-icons/social/mood-bad';
import CircularProgress from 'material-ui/lib/circular-progress';

const _ = require('lodash');
const request = require('superagent');

class Main extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this._bind('handleMenuTap', 'handleMenuClose', 'getChildContext', 'refreshJobStatus', 'componentDidMount');

    this.state = {
      menu_open: false,
      current_menu: 'dashboard',
      sab_status: null
    };
  }

  getChildContext() {
    return {muiTheme: ThemeManager.getMuiTheme(AppTheme)};
  }

  handleMenuTap() {
    this.setState({menu_open: true});
  }

  handleMenuClose(menuitem) {
    const self = this;
    return function (event) {
      self.setState({
        current_menu: menuitem,
        menu_open: false
      });
    }
  }

  refreshJobStatus() {
    request.get('/api/streams/jobs')
      .end(null);
  }

  componentDidMount() {
    const self = this;
    this.socket = io();
    this.socket.on('streamjobs', function(status) {
      if (status == null) {
        self.setState({
          sab_status: (
            <CircularProgress color={yellow200} size={0.3} />
          )
        });
      } else if (status.jobs && status.jobs.length >= 4) {
        if (_.every(status.jobs, { 'health': 'healthy' })) {
          self.setState({
            sab_status: (
              <IconButton
                tooltip="Streams Jobs Healthy. You are good to go!"
                tooltipPosition="bottom-left"
                onMouseDown={self.refreshJobStatus}>
                <MoodGood color={greenA200} />
              </IconButton>
            )
          });
        } else {
          self.setState({
            sab_status: (
              <IconButton
                tooltip="Streams Jobs Initializing. Click to refresh status"
                tooltipPosition="bottom-left"
                onMouseDown={self.refreshJobStatus}>
                <MoodGood color={yellow200} />
              </IconButton>
            )
          });
        }
      } else {
        self.setState({
          sab_status: (
            <IconButton
              tooltip="Streams Jobs Not Healthy. Go to Settings for more detail."
              tooltipPosition="bottom-left"
              onMouseDown={self.refreshJobStatus}>
              <MoodBad color={red500} />
            </IconButton>
          )
        });
      }
    });
    this.refreshJobStatus();
  }

  render() {
    let bodyElement = <Dashboard />;
    if (this.state.current_menu === 'settings') {
      bodyElement = <Settings />;
    }

    return (
      <div>
        <AppBar
          title={`Water Conservation v${process.env.npm_package_version}`} onLeftIconButtonTouchTap={this.handleMenuTap}
          iconElementRight={this.state.sab_status}
        />
        <LeftNav
          docked={false}
          open={this.state.menu_open}
          onRequestChange={open => this.setState({menu_open: open})}
        >
          <MenuItem onTouchTap={this.handleMenuClose('dashboard')}>Dashboard</MenuItem>
          <MenuItem onTouchTap={this.handleMenuClose('settings')}>Settings</MenuItem>
        </LeftNav>
        {bodyElement}
      </div>
    );
  }
}

//the key passed through context must be called "muiTheme"
Main.childContextTypes = {
  muiTheme: React.PropTypes.object
}

export default Main;
