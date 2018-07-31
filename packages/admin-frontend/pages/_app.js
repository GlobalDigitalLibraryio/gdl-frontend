// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import NextApp, { Container as NextContainer } from 'next/app';
import Error from './_error';
import type { $Request, $Response } from 'express';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';

import { hasClaim, claims, hasAuthToken, setRedirectUrl } from 'gdl-auth';
import Router from 'next/router';
import { Button } from '@material-ui/core';

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

    // If we have response object, set a proper HTTP status code
    if (!userHasAdminPrivileges && ctx.res) {
      ctx.res.statusCode = 403;
    }

    return { pageProps, userHasAdminPrivileges, userHasAuthToken };
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

  handleLogInClick = () => {
    setRedirectUrl({
      pathname: `/admin${this.props.router.pathname}`,
      asPath: `${this.props.router.asPath}`,
      query: this.props.router.query
    });
    Router.replace('/auth/sign-in');
  };

  render() {
    const {
      Component,
      userHasAdminPrivileges,
      pageProps,
      userHasAuthToken
    } = this.props;

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
      <Error statusCode={403} {...pageProps}>
        {!userHasAuthToken && (
          <div>
            <p>You must log in to access this page.</p>
            <Button variant="outlined" onClick={this.handleLogInClick}>
              Log in
            </Button>
          </div>
        )}
      </Error>
    );

    return <NextContainer>{Page}</NextContainer>;
  }
}

export default App;
