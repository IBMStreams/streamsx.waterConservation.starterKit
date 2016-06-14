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

import BaseComponent from './common/BaseComponent';
const moment = require('moment');

class CountdownTimer extends BaseComponent {
  constructor(props, context) {
    super(props, context);

    this._bind('tick', 'componentDidMount', 'componentWillUnmount', 'componentWillReceiveProps');
    this.state = {
      secondsRemaining: 0
    }
  }

  tick() {
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval);
    } else {
      this.setState({
        secondsRemaining: this.state.secondsRemaining - 1
      });
    }
  }

  componentWillReceiveProps(props) {
    this.setState({secondsRemaining: props.secondsRemaining});
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(this.tick, 1000);
  }

  componentDidMount() {
    this.setState({secondsRemaining: this.props.secondsRemaining});
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const timeRemaining = moment("2016-01-01").startOf('day').seconds(this.state.secondsRemaining).format('H:mm:ss');

    return (
      <span>{timeRemaining}</span>
    );
  }
};

export default CountdownTimer;
