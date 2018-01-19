// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Router from 'next/router';
import { hydrate } from 'react-emotion';
import withI18n from './withI18n';
import withTheme from './withTheme';
import withErrorBoundary from './withErrorBoundary';
import type { Context } from '../types';
import { getAuthToken, LOGOUT_KEY } from '../lib/auth/token';
import logPageView from '../lib/analytics';

logPageView();

// Adds server generated styles to emotion cache.
// '__NEXT_DATA__.ids' is set in '_document.js'
/* eslint-disable no-underscore-dangle */
if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
  hydrate(window.__NEXT_DATA__.ids);
}

/**
 * HoC that combines all necessary pages wrapper so we get a single point of entry
 * It also makes sure we have a token to the APIs
 */

const defaultPage = Page =>
  class DefaultPage extends React.Component<any> {
    static async getInitialProps(ctx: Context) {
      const personalToken = getAuthToken(ctx.req);
      const isAuthenticated = Boolean(personalToken);

      ctx.isAuthenticated = isAuthenticated;

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps;
      // Check if it actually is a next page
      if (typeof Page.getInitialProps === 'function') {
        composedInitialProps = await Page.getInitialProps(ctx);
      }

      return {
        isAuthenticated,
        ...composedInitialProps
      };
    }

    componentDidMount() {
      // Listen to localstorage changes.
      window.addEventListener('storage', this.logout, false);
    }

    componentWillUnmount() {
      window.removeEventListener('storage', this.logout, false);
    }

    logout = (event: StorageEvent) => {
      // Since localstorage is available across all tabs, this effectively means we log out of all tabs if we log out of one
      if (event.key === LOGOUT_KEY && event.newValue) {
        Router.push(`/?logout=${event.newValue}`);
      }
    };

    render() {
      return <Page {...this.props} />;
    }
  };

export default (
  Page: React.ComponentType<any>,
  wrapWithErrorBoundary: boolean = true
) =>
  defaultPage(
    withTheme(withI18n(wrapWithErrorBoundary ? withErrorBoundary(Page) : Page))
  );
