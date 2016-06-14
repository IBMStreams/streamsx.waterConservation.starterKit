/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import LiquidGauge from './LiquidGauge';
import Sparkline from 'react-sparklines';

class Gauge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reverse: false,
      width: 100
    };
  }

  componentDidMount() {
    this.setState({width: ReactDOM.findDOMNode(this).offsetWidth});
  }

  componentWillReceiveProps(nextProps) {
    let history = this.state.history || new Array(100).fill(0);

    if (history.length > 100) 
      history.shift();
    
    history.push(nextProps.value);

    this.setState({history: history, width: ReactDOM.findDOMNode(this).offsetWidth});
  }

  handleClick() {
    if (this.state && this.state.reverse) {
      this.setState({reverse: false});
    } else {
      this.setState({reverse: true});
    }
  }

  setShowTrendline() {
    this.setState({
      showTrendline: !this.state.showTrendline
    });
  }

  renderSparkline() {
    const {style} = Gauge;
    const {history, showTrendline, width} = this.state;

    if (showTrendline) {
      return <Sparkline strokeColor={style.container.color} height={40} width={width - 12} data={history}/>
    } else {
      return null;
    }
  }

  renderObverse() {
    return (
      <div>
        <LiquidGauge value={this.props.value} waveAnimateTime={2000} waveHeight={0.075} circleThickness={0.11} textSize={0.8} textColor={'#178BCA'} diameter={this.state.width - 12}/> {this.renderSparkline()}
        <div style={Gauge.style.label}>{this.props.label}</div>
      </div>
    );
  }

  renderReverse() {
    const {style} = Gauge;
    const {showTrendline} = this.state;

    return (
      <div>
        <h1 style={style.label}>Settings</h1>
        <label for='cbx'><input type='checkbox' name='cbx' checked={showTrendline} onChange={() => this.setShowTrendline()}/>
          Show Trendline</label>
      </div>
    );
  }

  render() {
    const {reverse} = this.state;
    const {style} = Gauge;

    return (
      <div style={style.container}>
        {!reverse && this.renderObverse()}
        {reverse && this.renderReverse()}
        <span style={style.button} onClick={() => this.handleClick()}>
          <i className='fa fa-cog'></i>
        </span>
      </div>
    );
  }
}

Gauge.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  units: PropTypes.string,
  topLabel: PropTypes.bool
};

Gauge.style = {
  container: {
    position: 'relative',
    minWidth: 70,
    maxWidth: 100,
    minHeight: 70,
    // border: '1px solid black',
    // borderRadius: 4,
    // boxShadow: '2px 2px 3px #383838',
    padding: '5px 5px',
    marginLeft: 10,
    // backgroundColor: '#484848',
    // backgroundColor: 'white',
    color: '#eee',
    textAlign: 'center',
    lineHeight: 1,
    fontFamily: 'sans-serif'
  },
  value: {
    fontSize: '3em',
    margin: 0,
    overflow: 'hidden'
  },
  units: {
    textAlign: 'right',
    marginTop: -5
  },
  label: {
    fontSize: '1em',
    width: '100%',
    maxWidth: 200,
    textAlign: 'center',
    marginTop: 15,
    color: '#178BCA'
  },
  button: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    cursor: 'pointer'
  }
};

export default Gauge;
