/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
/*!
 * Based on d3 Liquid Fill Gauge by Curtis Bratton
 * (http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6)
 * Original code licensed under BSD 2-clause
 * (http://choosealicense.com/licenses/bsd-2-clause/)
 * Copyright (c) 2015, Curtis Bratton
 * All rights reserved.
 *
 * Liquid Fill Gauge v1.1
 */

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class LiquidGauge extends Component {
  componentDidMount() {
    const gauge = this.renderLiquidGauge("LiquidGauge", this.props.value);

    this.setState({gauge: gauge});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.diameter !== this.props.diameter) {
      const gauge = this.renderLiquidGauge("LiquidGauge", nextProps.value);
      this.setState({gauge: gauge});
    } else if (this.state !== null) {
      this.state.gauge.update(nextProps.value);
    }
  }

  render() {
    return <div/>;
  }
  renderLiquidGauge(elementId, value) {
    function deg2rad(deg) {
      return deg / 180 * Math.PI;
    }

    let config = this.props || {},
      el = ReactDOM.findDOMNode(this);

    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }

    let gauge = d3.select(el).append("svg").attr("width", config.diameter).attr("height", config.diameter);
    let radius = config.diameter / 2;
    let locationX = 0;
    let locationY = 0;
    let fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

    let waveHeightScale;
    if (config.waveHeightScaling) {
      waveHeightScale = d3.scale.linear().range([0, config.waveHeight, 0]).domain([0, 50, 100]);
    } else {
      waveHeightScale = d3.scale.linear().range([config.waveHeight, config.waveHeight]).domain([0, 100]);
    }

    let textPixels = (config.textSize * radius / 2);
    let textFinalValue = parseFloat(value).toFixed(2);
    let textStartValue = config.valueCountUp
      ? config.minValue
      : textFinalValue;
    let percentText = config.displayPercent
      ? "%"
      : "";
    let circleThickness = config.circleThickness * radius;
    let circleFillGap = config.circleFillGap * radius;
    let fillCircleMargin = circleThickness + circleFillGap;
    let fillCircleRadius = radius - fillCircleMargin;
    let waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

    let waveLength = fillCircleRadius * 2 / config.waveCount;
    let waveClipCount = 1 + config.waveCount;
    let waveClipWidth = waveLength * waveClipCount;

    // Rounding functions so that the correct number of decimal places is
    // always displayed as the value counts up.
    let textRounder = function(value) {
      return Math.round(value);
    };

    if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
      textRounder = function(value) {
        return parseFloat(value).toFixed(1);
      };
    }

    if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
      textRounder = function(value) {
        return parseFloat(value).toFixed(2);
      };
    }

    // Data for building the clip wave area.
    let data = [];
    for (let i = 0; i <= 40 * waveClipCount; i++) {
      data.push({
        x: i / (40 * waveClipCount),
        y: (i / 40)
      });
    }

    // Scales for drawing the outer circle.
    let gaugeCircleX = d3.scale.linear().range([
      0, 2 * Math.PI
    ]).domain([0, 1]);
    let gaugeCircleY = d3.scale.linear().range([0, radius]).domain([0, radius]);

    // Scales for controlling the size of the clipping path.
    let waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
    let waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

    // Scales for controlling the position of the clipping path.
    let waveRiseScale = d3.scale.linear()
    // The clipping area size is the height of the fill circle + the wave
    // height, so we position the clip wave such that the it will not
    // overlap the fill circle at all when at 0%, and will totally cover
    // the fill circle at 100%.
      .range([
      fillCircleMargin + fillCircleRadius * 2 + waveHeight,
      fillCircleMargin - waveHeight
    ]).domain([0, 1]);

    let waveAnimateScale = d3.scale.linear()
    // Push the clip area one full wave then snap back.
      .range([
      0, waveClipWidth - fillCircleRadius * 2
    ]).domain([0, 1]);

    // Scale for controlling the position of the text within the gauge.
    let textRiseScaleY = d3.scale.linear().range([
      fillCircleMargin + fillCircleRadius * 2,
      fillCircleMargin + textPixels * 0.7
    ]).domain([0, 1]);

    // Center the gauge within the parent SVG.
    let gaugeGroup = gauge.append("g").attr('transform', 'translate(' + locationX + ',' + locationY + ')');

    // Draw the outer circle.
    let gaugeCircleArc = d3.svg.arc().startAngle(gaugeCircleX(0)).endAngle(gaugeCircleX(1)).outerRadius(gaugeCircleY(radius)).innerRadius(gaugeCircleY(radius - circleThickness));

    gaugeGroup.append("path").attr("d", gaugeCircleArc).style("fill", config.circleColor).attr('transform', 'translate(' + radius + ',' + radius + ')');

    // Text where the wave does not overlap.
    let text1 = gaugeGroup.append("text").text(textRounder(textStartValue) + percentText).attr("class", "liquidFillGaugeText").attr("text-anchor", "middle").attr("font-size", textPixels + "px").style("fill", config.textColor).attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

    // The clipping wave area.
    let clipArea = d3.svg.area().x(function(d) {
      return waveScaleX(d.x);
    }).y0(function(d) {
      return (waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)));
    }).y1(function(d) {
      return (fillCircleRadius * 2 + waveHeight);
    });

    let waveGroup = gaugeGroup.append("defs").append("clipPath").attr("id", "clipWave" + elementId);

    let wave = waveGroup.append("path").datum(data).attr("d", clipArea).attr("T", 0);

    // The inner circle with the clipping wave attached.
    let fillCircleGroup = gaugeGroup.append("g").attr("clip-path", "url(#clipWave" + elementId + ")");

    fillCircleGroup.append("circle").attr("cx", radius).attr("cy", radius).attr("r", fillCircleRadius).style("fill", config.waveColor);

    // Text where the wave does overlap.
    let text2 = fillCircleGroup.append("text").text(textRounder(textStartValue) + percentText).attr("class", "liquidFillGaugeText").attr("text-anchor", "middle").attr("font-size", textPixels + "px").style("fill", config.waveTextColor).attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

    // Make the value count up.
    if (config.valueCountUp) {
      let textTween = function() {
        let i = d3.interpolate(this.textContent, textFinalValue);
        return function(t) {
          this.textContent = textRounder(i(t)) + percentText;
        }
      };
      text1.transition().duration(config.waveRiseTime).tween("text", textTween);
      text2.transition().duration(config.waveRiseTime).tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal
    // and vertical movement can be controlled independently.
    let waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
    if (config.waveRise) {
      waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')').transition().duration(config.waveRiseTime).attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')').each("start", function() {
        // This transform is necessary to get the clip wave positioned
        // correctly when waveRise=true and waveAnimate=false. The wave will
        // not position correctly without this, but it's not clear why this
        // is actually necessary.
        wave.attr('transform', 'translate(1,0)');
      });
    } else {
      waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');
    }

    if (config.waveAnimate) {
      animateWave();
    }

    function animateWave() {
      wave.attr('transform', 'translate(' + waveAnimateScale(wave.attr('T')) + ',0)');
      wave.transition().duration(config.waveAnimateTime * (1 - wave.attr('T'))).ease('linear').attr('transform', 'translate(' + waveAnimateScale(1) + ',0)').attr('T', 1).each('end', function() {
        wave.attr('T', 0);
        animateWave(config.waveAnimateTime);
      });
    }

    function GaugeUpdater() {
      this.update = function(value) {
        let newFinalValue = parseFloat(value).toFixed(2);
        let textRounderUpdater = function(value) {
          return Math.round(value);
        };
        if (parseFloat(newFinalValue) !== parseFloat(textRounderUpdater(newFinalValue))) {
          textRounderUpdater = function(value) {
            return parseFloat(value).toFixed(1);
          };
        }
        if (parseFloat(newFinalValue) !== parseFloat(textRounderUpdater(newFinalValue))) {
          textRounderUpdater = function(value) {
            return parseFloat(value).toFixed(2);
          };
        }

        let textTween = function() {
          let i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
          return function(t) {
            this.textContent = textRounderUpdater(i(t)) + percentText;
          }
        };

        text1.transition().duration(config.waveRiseTime).tween("text", textTween);

        text2.transition().duration(config.waveRiseTime).tween("text", textTween);

        let fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

        let waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

        let waveRiseScale = d3.scale.linear()
        // The clipping area size is the height of the fill circle + the wave
        // height, so we position the clip wave such that the it will overlap
        // the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
          .range([
          (fillCircleMargin + fillCircleRadius * 2 + waveHeight),
          (fillCircleMargin - waveHeight)
        ]).domain([0, 1]);

        let newHeight = waveRiseScale(fillPercent);

        let waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);

        let waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

        let newClipArea;
        if (config.waveHeightScaling) {
          newClipArea = d3.svg.area().x(function(d) {
            return waveScaleX(d.x);
          }).y0(function(d) {
            return (waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)));
          }).y1(function(d) {
            return (fillCircleRadius * 2 + waveHeight);
          });
        } else {
          newClipArea = clipArea;
        }

        let newWavePosition = config.waveAnimate
          ? waveAnimateScale(1)
          : 0;

        wave.transition().duration(0).transition().duration(config.waveAnimate
          ? (config.waveAnimateTime * (1 - wave.attr('T')))
          : (config.waveRiseTime)).ease('linear').attr('d', newClipArea).attr('transform', 'translate(' + newWavePosition + ',0)').attr('T', '1').each("end", function() {
          if (config.waveAnimate) {
            wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
            animateWave(config.waveAnimateTime);
          }
        });
        waveGroup.transition().duration(config.waveRiseTime).attr('transform', 'translate(' + waveGroupXPosition + ',' + newHeight + ')')
      }
    }

    return new GaugeUpdater();
  }
}

LiquidGauge.propTypes = {
  circleColor: PropTypes.string,
  circleFillGap: PropTypes.number,
  circleThickness: PropTypes.number,
  diameter: PropTypes.number,
  displayPercent: PropTypes.bool,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  textColor: PropTypes.string,
  textSize: PropTypes.number,
  textVertPosition: PropTypes.number,
  valueCountUp: PropTypes.bool,
  waveAnimate: PropTypes.bool,
  waveAnimateTime: PropTypes.number,
  waveColor: PropTypes.string,
  waveCount: PropTypes.number,
  waveHeight: PropTypes.number,
  waveHeightScaling: PropTypes.bool,
  waveOffset: PropTypes.number,
  waveRise: PropTypes.bool,
  waveRiseTime: PropTypes.number,
  waveTextColor: PropTypes.string
};

LiquidGauge.defaultProps = {
  // The color of the outer circle.
  circleColor: "#178BCA",

  // The size of the gap between the outer circle and wave circle as a
  //percentage of the outer circle's radius.
  circleFillGap: 0.05,

  // The outer circle thickness as a percentage of its radius.
  circleThickness: 0.05,

  // Size ofthe gauge
  diameter: 200,

  // If true, a % symbol is displayed after the value.
  displayPercent: true,

  // The gauge maximum value.
  maxValue: 100,

  // The gauge minimum value.
  minValue: 0,

  // The color of the value text when the wave does not overlap it.
  textColor: "#045681",

  // The relative height of the text to display in the wave circle. 1 = 50%.
  textSize: 1,

  // The height at which to display the percentage text withing the wave
  // circle. 0 = bottom, 1 = top.
  textVertPosition: .5,

  // If true, the displayed value counts up from 0 to its final value upon
  // loading. If false, the final value is displayed.
  valueCountUp: false,

  // Controls if the wave scrolls or is static.
  waveAnimate: true,

  // The amount of time in milliseconds for a full wave to enter the wave
  // circle.
  waveAnimateTime: 18000,

  // The color of the fill wave.
  waveColor: "#178BCA",

  // The number of full waves per width of the wave circle.
  waveCount: 1,

  // The wave height as a percentage of the radius of the wave circle.
  waveHeight: 0.05,

  // Controls wave size scaling at low and high fill percentages. When true,
  // wave height reaches its maximum at 50% fill, and minimum at 0% and 100%
  // fill. This helps to prevent the wave from making the wave circle appear
  // totally full or empty when near its minimum or maximum fill.
  waveHeightScaling: true,

  // The amount to initially offset the wave. 0 = no offset. 1 = offset of
  // one full wave.
  waveOffset: 0,

  // Control if the wave should rise from 0 to its full height, or start at
  // its full height.
  waveRise: true,

  // The amount of time in milliseconds for the wave to rise from 0 to its
  // final height.
  waveRiseTime: 0,

  // The color of the value text when the wave overlaps it.
  waveTextColor: "#A4DBf8"
};

export default LiquidGauge;
