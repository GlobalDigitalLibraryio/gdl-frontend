// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import NextApp, { Container as NextContainer } from 'next/app';
import Head from 'next/head';
import { hydrate } from 'react-emotion';
import Router from 'next/router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';

import getPageContext from '../getPageContext';
import Raven from '../lib/raven';
import type { Context } from '../types';
import GdlI18nProvider from '../components/GdlI18nProvider';
import { LOGOUT_KEY } from '../lib/auth/token';
import { DEFAULT_TITLE } from '../components/Head';
import { logPageView, initGA } from '../lib/analytics';

// Adds server generated styles to the emotion cache.
// '__NEXT_DATA__.ids' is set in '_document.js'
if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
  hydrate(window.__NEXT_DATA__.ids);
}

class App extends NextApp {
  static async getInitialProps({
    Component,
    ctx
  }: {
    Component: any,
    ctx: Context
  }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  constructor(props: {}) {
    super(props);
    this.pageContext = getPageContext();
  }

  // componentDidCatch works only in the client, not on the server
  componentDidCatch(error: *, errorInfo: *) {
    Raven.captureException(error, { extra: errorInfo });
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  componentDidMount() {
    // Listen to log out events (across all tabs)
    window.addEventListener('storage', this.logout, false);

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    // Setup Google Analytics to log the current page and subsequent other pages
    initGA();
    logPageView();
    Router.router.events.on('routeChangeComplete', logPageView);
  }

  componentWillUnmount() {
    // Stop listening to logout events
    window.removeEventListener('storage', this.logout, false);
  }

  /**
   * Redirect to front page on logout. Ensures we don't display content in another tab when the user has logged out
   */
  logout = (event: StorageEvent) => {
    if (event.key === LOGOUT_KEY && event.newValue) {
      Router.push(`/?logout=${event.newValue}`);
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <NextContainer>
        <Head>
          <title>{DEFAULT_TITLE}</title>
        </Head>
        <GdlI18nProvider>
          {/* Wrap every page in Jss and Theme providers */}
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
              {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server side. */}
              <Component pageContext={this.pageContext} {...pageProps} />
            </MuiThemeProvider>
          </JssProvider>
        </GdlI18nProvider>
      </NextContainer>
    );
  }
}

export default App;
