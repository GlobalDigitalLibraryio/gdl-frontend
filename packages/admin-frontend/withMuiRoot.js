// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import getPageContext from './getPageContext';

function withRoot(Component: React.ComponentType<*>) {
  class WithRoot extends React.Component<*> {
    constructor(props: *) {
      super(props);

      this.pageContext = this.props.pageContext || getPageContext();
    }

    pageContext: * = null;

    render() {
      // MuiThemeProvider makes the theme available down the React tree thanks to React context.
      return (
        <JssProvider
          jss={this.pageContext.jss}
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...this.props} />
          </MuiThemeProvider>
        </JssProvider>
      );
    }
  }

  WithRoot.propTypes = {
    pageContext: PropTypes.object
  };

  // $FlowFixMe: Don't care about flow here
  WithRoot.getInitialProps = ctx => {
    if (typeof Component.getInitialProps === 'function') {
      return Component.getInitialProps(ctx);
    }

    return {};
  };

  return WithRoot;
}

export default withRoot;
