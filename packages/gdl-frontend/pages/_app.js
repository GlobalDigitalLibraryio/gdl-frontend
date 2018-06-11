// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

// Explicitly import the polyfills needed to at least render in IE11
import 'core-js/modules/es6.array.find';
import 'core-js/modules/es6.object.assign';
import 'core-js/modules/es6.string.includes';
import 'core-js/modules/es7.object.entries';
import 'core-js/modules/es7.object.values';
import 'core-js/modules/es7.array.includes';
import React from 'react';
import NextApp, { Container as NextContainer } from 'next/app';
import { hydrate } from 'react-emotion';
import Router from 'next/router';

import Raven from '../lib/raven';
import type { Context } from '../types';
import GdlThemeProvider from '../components/GdlThemeProvider';
import GdlI18nProvider from '../components/GdlI18nProvider';
import { LOGOUT_KEY } from '../lib/auth/token';
import logPageView from '../lib/analytics';

// Analytics
logPageView();

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

  // componentDidCatch works only in the client, not on the server
  componentDidCatch(error: *, errorInfo: *) {
    Raven.captureException(error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  /**
   * Listen to log out events (across all tabs)
   */
  componentDidMount() {
    window.addEventListener('storage', this.logout, false);
  }

  // Stop listening to logout events
  componentWillUnmount() {
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
        <GdlThemeProvider>
          <GdlI18nProvider>
            <Component {...pageProps} />
          </GdlI18nProvider>
        </GdlThemeProvider>
      </NextContainer>
    );
  }
}

export default App;
