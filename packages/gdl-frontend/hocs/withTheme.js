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
import type { Context } from '../types';
import { misc } from '../style/theme';

const theme = { space: [], breakpoints: misc.breakpoints };

class Theme extends React.Component<{ children: React.Node }> {
  static childContextTypes = {
    reactIconBase: PropTypes.object
  };

  getChildContext() {
    return {
      reactIconBase: {
        size: misc.iconSize
      }
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
    static getInitialProps(context: Context) {
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

export { Theme, withTheme as default };
