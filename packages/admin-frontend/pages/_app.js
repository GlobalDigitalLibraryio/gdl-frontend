// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import NextApp, { Container as NextContainer } from 'next/app';
import Error from 'next/error';
import type { $Request, $Response } from 'express';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';

import { hasClaim, claims, hasAuthToken } from 'gdl-auth';

import getPageContext from '../getPageContext';

type Context = {
  req?: $Request,
  res?: $Response
};

/**
 * Since we don't really care about SSR in the admin app, we do a small trick here to just render when we're on the client
 */
class App extends NextApp {
  /**
   * Make sure the user actually has admin access
   */
  static async getInitialProps({
    Component,
    ctx
  }: {
    Component: React.ComponentType<*>,
    ctx: Context
  }) {
    let pageProps = {};

    if (typeof Component.getInitialProps === 'function') {
      pageProps = await Component.getInitialProps(ctx);
    }

    const userHasAuthToken = hasAuthToken(ctx.req);

    const userHasAdminPrivileges = hasClaim(claims.readAdmin, ctx.req);

    // If user is not logged in
    if (!userHasAuthToken){
      // TODO: Implement so that it redirects to log in page if not logged in/ has auth token
    }

    // If we have response object, set a proper HTTP status code
    if (!userHasAdminPrivileges && ctx.res) {
      ctx.res.statusCode = 403;
    }

    return { pageProps, userHasAdminPrivileges };
  }

  state = {
    isClient: false
  };

  constructor(props: {}) {
    super(props);
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    this.setState({ isClient: true });
  }

  render() {
    const { Component, userHasAdminPrivileges, pageProps } = this.props;

    const Page = userHasAdminPrivileges ? (
      this.state.isClient ? (
        <JssProvider
          jss={this.pageContext.jss}
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component pageContext={this.pageContext} {...pageProps} />
          </MuiThemeProvider>
        </JssProvider>
      ) : null
    ) : (
      <Error statusCode={403} {...pageProps} />
    );

    return <NextContainer>{Page}</NextContainer>;
  }
}

export default App;
