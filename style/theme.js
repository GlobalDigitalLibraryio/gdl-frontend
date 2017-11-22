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
    link: '#1566b6',
    white: '#fff',
    dark: '#444',
    primary: '#20588f',
    grayDarker: '#666', // Grey steel
    grayDark: '#888', // Grey Jumbo
    gray: '#bbb', // Silver Sand
    grayLight: '#e3e3e3', // Gray Platinum
    grayLighter: '#eff0f2', // Gray gallery
    whiteTer: '#f8f8f8', // Desert storm
    greenHighlight: '#edfff4',
    greenDark: '#359258',
    highlight: '#edf7ff',
  },
  breakpoints: [`${TABLET_BREAKPOINT}px`],
};

export { theme as default, TABLET_BREAKPOINT };
