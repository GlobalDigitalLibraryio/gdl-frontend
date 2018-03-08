// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

const TABLET_BREAKPOINT = 768;

// TODO: Move all colors into the colors object
const theme = {
  colors: {
    link: '#026cd2',
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
      lighter: '#73a9d9'
    },
    greens: {
      dark: '#008251',
      green: '#00ba6e',
      light: '#00c982',
      lighter: '#4fdaa9'
    },
    limes: {
      dark: '#268200',
      green: '#77c544',
      light: '#7bd25a',
      lighter: '#a7e08f'
    },
    oranges: {
      dark: '#c36a00',
      orange: '#ffa200',
      light: '#ffaf00',
      lighter: '#ffc865'
    },
    reds: {
      dark: '#830005',
      red: '#ae0e16',
      light: '#cd3744',
      lighter: '#df767d'
    },
    pinks: {
      dark: '#842e5c',
      pink: '#b25187',
      light: '#cc6c9d',
      lighter: '#dd9bbd'
    }
  },
  breakpoints: [`${TABLET_BREAKPOINT}px`],
  space: [],
  borderRadius: '0px',
  boxShadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    large: '0 4px 20px rgba(0, 0, 0, 0.2)'
  },
  containers: {
    large: '1024px',
    small: '738px'
  }
};

export { theme as default, TABLET_BREAKPOINT };
