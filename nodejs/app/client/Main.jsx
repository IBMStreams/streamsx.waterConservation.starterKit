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

class Main extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this._bind('handleMenuTap', 'handleMenuClose', 'getChildContext');

    this.state = {
      menu_open: false,
      current_menu: 'dashboard'
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

  render() {
    let bodyElement = <Dashboard />;
    if (this.state.current_menu === 'settings') {
      bodyElement = <Settings />;
    }

    return (
      <div>
        <AppBar
          title={`Water Conservation v${process.env.npm_package_version}`} onLeftIconButtonTouchTap={this.handleMenuTap}
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
