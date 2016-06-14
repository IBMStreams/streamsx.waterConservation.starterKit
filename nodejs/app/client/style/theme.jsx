/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

export default {
  spacing : Spacing,
  zIndex : zIndex,
  fontFamily : 'Roboto, sans-serif',
  palette : {
    primary1Color: '#293E6A',
    primary2Color: '#90C5A9',
    primary3Color: Colors.indigo100,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.darkBlack,
    alternateTextColor: '#5FA292',
    canvasColor: Colors.grey200,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.indigo500
  },

  // Custom elements
  cardTitleColor : '#293E6A',
  cardSubtitleColor : Colors.darkBlack,
  temperatureBar : '#253939',
  forecastBackground : '#7A9A95',
  cardActionsBackground : '#7A9A95',
  moistureLineColor : '#178BCA',
  sprinklerOnColor : '#FF8B6C',
  waterEventColor : '#5FA292',
  moistureLoThresholdColor : '#FF8B6C',
  moistureHiThresholdColor : Colors.green300
};

// export default {
//   spacing : Spacing,
//   zIndex : zIndex,
//   fontFamily : 'Roboto, sans-serif',
//   palette : {
//     primary1Color: '#253939',
//     primary2Color: '#558188',
//     primary3Color: Colors.indigo100,
//     accent1Color: Colors.pinkA200,
//     accent2Color: Colors.grey100,
//     accent3Color: Colors.grey500,
//     textColor: Colors.darkBlack,
//     alternateTextColor: Colors.white,
//     canvasColor: Colors.grey200,
//     borderColor: Colors.grey300,
//     disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
//     pickerHeaderColor: Colors.indigo500
//   },
//
//   // Custom elements
//   cardTitleColor : Colors.darkBlack,
//   cardSubtitleColor : Colors.darkBlack,
//   temperatureBar : '#253939',
//   forecastBackground : '#5FA292',
//   cardActionsBackground : '#5FA292',
//   moistureLineColor : '#178BCA',
//   sprinklerOnColor : '#FF8B6C',
//   sprinklerOffColor : '#5FA292',
//   moistureLoThresholdColor : '#FF8B6C',
//   moistureHiThresholdColor : Colors.green300
// };