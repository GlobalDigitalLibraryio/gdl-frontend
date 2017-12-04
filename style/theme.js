// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

const TABLET_BREAKPOINT = 769;

// TODO: Move all colors into the colors object
const theme = {
  colors: {
    link: '#0085dd',
    white: '#fff',
    dark: '#444',
    grayDarker: '#666', // Grey steel
    grayDark: '#888', // Grey Jumbo
    gray: '#bbb', // Silver Sand
    grayLight: '#e3e3e3', // Gray Platinum
    grayLighter: '#eff0f2', // Gray gallery
    whiteTer: '#f8f8f8', // Desert storm
    greenHighlight: '#edfff4',
    greenDark: '#359258',
    highlight: '#edf7ff',
    blues: {
      dark: '#004380',
      blue: '#1466b5',
      light: '#2c79b9',
      lighter: '#73a9d9',
    },
    greens: {
      green: '#00ba6e',
    },
  },
  breakpoints: [`${TABLET_BREAKPOINT}px`],
  borderRadius: '0px',
  containers: {
    large: '1024px',
    small: '738px',
  },
};

export { theme as default, TABLET_BREAKPOINT };
