// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

/* eslint-disable react/no-multi-comp */

const theme = {
  primaries: {
    primary: '#20588f',
    secondary: '#507aa4',
    tertiary: '#a5bcd3',
    light: '#ceddea',
    highlight: '#edf7ff',
    dark: '#184673',
  },
  supports: {
    greenPrimary: '#5cbc80',
    greenHighlight: '#edfff4',
    greenDark: '#359258',
  },
  grays: {
    dark: '#444',
    white: '#fff',
    steel: '#666',
    jumbo: '#888',
    silverSand: '#bbb',
    platinum: '#e3e3e3',
    gallery: '#eff0f2',
    desertStorm: '#f8f8f8',
  },
};

class Theme extends React.Component<{ children: React.Node }> {
  static childContextTypes = {
    reactIconBase: PropTypes.object,
  };

  getChildContext() {
    return {
      reactIconBase: {
        size: 24,
      },
    };
  }

  render() {
    return <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>;
  }
}

/**
 * HoC that wraps a page with Theme
 */
function withTheme(Page: React.ComponentType<any>) {
  return class PageWithTheme extends React.Component<any> {
    static getInitialProps(context) {
      if (typeof Page.getInitialProps === 'function') {
        return Page.getInitialProps(context);
      }
      return undefined;
    }

    render() {
      return (
        <Theme>
          <Page {...this.props} />
        </Theme>
      );
    }
  };
}

export { Theme, theme, withTheme as default };
