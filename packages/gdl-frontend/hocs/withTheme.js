// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'emotion-theming';

import { misc } from '../style/theme';

const theme = { space: [], breakpoints: misc.breakpoints };

/**
 * HoC that wraps an App with our theme
 */
export default (App: React.ComponentType<*>) => {
  return class Theme extends React.Component<*> {
    static displayName = 'withTheme(App)';

    static getInitialProps = App.getInitialProps;

    static childContextTypes = {
      reactIconBase: PropTypes.object
    };

    // Define icon size
    getChildContext() {
      return {
        reactIconBase: {
          size: misc.iconSize
        }
      };
    }

    render() {
      return (
        <ThemeProvider theme={theme}>
          <App {...this.props} />
        </ThemeProvider>
      );
    }
  };
};
