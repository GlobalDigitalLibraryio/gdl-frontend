// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Router from 'next/router';
import withI18n from './withI18n';
import withTheme from './withTheme';
import withErrorBoundary from './withErrorBoundary';
import {
  setAnonToken,
  getAccessTokenFromRequest,
  getAccessTokenFromLocalStorage,
  setAnonTokenOnResponse,
  LOGOUT_KEY,
} from '../lib/auth/token';
import { fetchAnonToken } from '../fetch';
import { logPageView } from '../lib/analytics';


if (typeof window !== 'undefined') {
  logPageView();
}

/**
 * HoC that combines all necessary pages wrapper so we get a single point of entry
 * It also makes sure we have a token to the APIs
 */

const defaultPage = Page =>
  class DefaultPage extends React.Component<any> {
    static async getInitialProps(ctx) {
      const accessToken = process.browser
        ? getAccessTokenFromLocalStorage()
        : getAccessTokenFromRequest(ctx.req);

      let fullToken;
      // If there is no access token and we're on the server, generate one and set it as a cookie
      if (!accessToken) {
        fullToken = await fetchAnonToken();
        // On the client, this is set in componentDidMount()
        if (!process.browser) {
          setAnonTokenOnResponse(ctx.res, fullToken);
        }
      }

      ctx.accessToken = accessToken || (fullToken && fullToken.access_token);

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps;
      // Check if it actually is a next page
      if (typeof Page.getInitialProps === 'function') {
        composedInitialProps = await Page.getInitialProps(ctx);
      }

      return {
        fullToken,
        ...composedInitialProps,
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

    // $FlowFixMe: StorageEvent was added to Flow in v0.58.0, so remove this line after we've upgraded 
    logout = (event: StorageEvent) => {
      if (event.key === LOGOUT_KEY) {
        Router.push(`/?logout=${event.newValue}`);
      }
    }

    render() {
      const { token, ...props } = this.props;
      return <Page {...props} />;
    }
  };

export default (
  Page: React.ComponentType<any>,
  wrapWithErrorBoundary: boolean = true,
) =>
  defaultPage(
    withTheme(withI18n(wrapWithErrorBoundary ? withErrorBoundary(Page) : Page)),
  );
