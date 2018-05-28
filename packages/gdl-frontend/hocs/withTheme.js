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
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';

import getPageContext from '../getPageContext';
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

//const jss = create(jssPreset());

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

    constructor(props, context) {
      super(props, context);
      this.pageContext = this.props.pageContext || getPageContext();
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return (
        <Theme>
          <JssProvider
            jss={this.pageContext.jss}
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
          >
            <MuiThemeProvider sheetsManager={this.pageContext.sheetsManager}>
              <CssBaseline />
              <Page {...this.props} />
            </MuiThemeProvider>
          </JssProvider>
        </Theme>
      );
    }
  };
}

export { Theme, withTheme as default };
