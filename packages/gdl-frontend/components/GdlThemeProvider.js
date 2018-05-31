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
 *  Setup the theme of our application
 */
export default class GdlThemeProvider extends React.Component<*> {
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
    return <ThemeProvider theme={theme} {...this.props} />;
  }
}
