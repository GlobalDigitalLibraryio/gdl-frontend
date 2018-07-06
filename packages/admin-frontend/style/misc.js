// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
const TABLET_BREAKPOINT = 768;

const misc = {
  iconSize: 24,
  radius: '4px',
  breakpoints: [`${TABLET_BREAKPOINT}px`],
  inputs: {
    padding: '10px'
  },
  containers: {
    large: '1024px',
    small: '738px'
  },
  boxShadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }
};

export { misc as default, TABLET_BREAKPOINT };
