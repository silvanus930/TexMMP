import {Colors} from 'react-native-ui-lib/core';

// TODO: add colours from constants/constantcolor and then delete that file
const WHITE = '#FFFFFF';
const PINK = '#EE2E7F';
const ORANGE = '#FFB71B';
const RED = '#FF0000';
const GREEN = '#00FF00';
const BLUE = '#359DD9';
const colours = {
  greenBright: '#00DF8F',
  greenDark: '#02BE9A',
  greenMid: '#02C39A',
  textLight: WHITE,
  textMid: '#B7B7B7',
  textDark: '#000000',
  light: WHITE,
  dark: '#121212',
  pink: PINK,
  pink5: '#EE2E7F07',
  red: RED,
  blue: BLUE,
  midBlue: '#79A7D3',
  darkBlueGrey: '#D2DBE5',
  dary50: '#0000007F',
  grey: '#F5F6F8',
  grey900: '#101828',
  grey600: '#475467',
  grey500: '#667085',
  grey400: '#98A2B3',
  purple: '#8347AD',
  purple150: '#8347AD26',
  greyLight: '#E5E7EB',
  greyMid: '#AAAAAA',
  blueGrey: '#DEE4EB',
  notSelected: '#A1A1AA',
  container: '#F5F6F8',
  courseTag1st: '#7253A2',
  courseTag2nd: PINK,
  courseTag3rd: ORANGE,
  faded: '#DEDEDE',
  blink: '#12AD2B',
  overlay: '#000000C4',
  divider: '#B1B1B1',
  line: '#C5C7C9',
  toast: ORANGE,
  textTint: '#777777',
  transparent: '#00000000',
  gradient1: '#7253A2',
  gradient2: PINK,
  gradient3: ORANGE,
  bottomNavigation: '#FAFAFB',
  bgGray: '#F0F0F0',
  bgOpacity3: '#00000088',
  bgOpacity4: '#0000003f',
  Opacity3: '#FFFFFF33',
  pass: GREEN,
  fail: RED,
};
Colors.loadColors(colours);
export default colours;
