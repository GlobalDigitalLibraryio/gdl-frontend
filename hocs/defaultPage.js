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
import {
  getAuthToken,
  getAnonToken,
  setAnonToken,
  setAnonTokenOnResponse,
  LOGOUT_KEY
} from '../lib/auth/token';
import { fetchAnonToken } from '../fetch';
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
      let accessToken = getAuthToken(ctx.req);
      const isAuthenticated = Boolean(accessToken);

      // If we aren't authenticated proper, check if we have an anonomyous access token
      if (!isAuthenticated) {
        accessToken = getAnonToken(ctx.req);
      }

      let fullToken;
      // If there is no access token and we're on the server, generate one and set it as a cookie
      if (!accessToken) {
        fullToken = await fetchAnonToken();
        // On the client, this is set in componentDidMount()
        if (!process.browser) {
          setAnonTokenOnResponse(ctx.res, fullToken);
        }
      }

      // $FlowFixMe
      ctx.accessToken = accessToken || (fullToken && fullToken.access_token);
      ctx.isAuthenticated = isAuthenticated;

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps;
      // Check if it actually is a next page
      if (typeof Page.getInitialProps === 'function') {
        composedInitialProps = await Page.getInitialProps(ctx);
      }

      return {
        fullToken,
        isAuthenticated,
        ...composedInitialProps
      };
    }

    componentDidMount() {
      // cDM only runs on the client, so if we get a token via props, set it in local storage.
      // We cannot read it from the cookies on the client, because we won't be able to access the expiration date then.
      if (this.props.fullToken) {
        setAnonToken(this.props.fullToken);
      }
      window.addEventListener('storage', this.logout, false);
    }

    componentWillUnmount() {
      window.removeEventListener('storage', this.logout, false);
    }

    logout = (event: StorageEvent) => {
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
