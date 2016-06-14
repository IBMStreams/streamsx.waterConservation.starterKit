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
import Paper from 'material-ui/lib/paper';

import BaseComponent from './common/BaseComponent';
import DeviceCfg from './DeviceCfg';
import StreamJobs from './StreamJobs';

class Settings extends BaseComponent {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const paper_style = {
      margin: 20
    };

    return (
      <div>
        <Paper zDepth={2} style={paper_style}>
          <DeviceCfg/>
        </Paper>
        <Paper zDepth={2} style={paper_style}>
          <StreamJobs/>
        </Paper>
      </div>
    );
  }
}

export default Settings;
