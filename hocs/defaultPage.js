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
import { LOGOUT_KEY } from '../lib/auth/token';
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
 */

const defaultPage = Page =>
  class DefaultPage extends React.Component<any> {
    static getInitialProps(ctx: Context) {
      return (
        typeof Page.getInitialProps === 'function' && Page.getInitialProps(ctx)
      );
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
