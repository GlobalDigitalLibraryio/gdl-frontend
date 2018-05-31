// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';

import getPageContext from '../getPageContext';
import type { Context } from '../types';
import { misc } from '../style/theme';

const theme = { space: [], breakpoints: misc.breakpoints };

/**
 *  Setup the theme of our application
 */
export default class GdlThemeProvider extends React.Component<*> {
  constructor(props, context: Context) {
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
      <ThemeProvider theme={theme}>
        <JssProvider
          jss={this.pageContext.jss}
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <>
            <CssBaseline />
            <MuiThemeProvider
              theme={this.pageContext.theme}
              sheetsManager={this.pageContext.sheetsManager}
              {...this.props}
            />
          </>
        </JssProvider>
      </ThemeProvider>
    );
  }
}
