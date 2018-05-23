// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
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
import * as React from 'react';
import Router from 'next/router';

import withI18n from './withI18n';
import type { Context } from '../types';
import { LOGOUT_KEY } from '../lib/auth/token';
import logPageView from '../lib/analytics';

logPageView();

/**
 * HoC that combines all necessary pages wrapper so we get a single point of entry
 * It also makes sure we have a token to the APIs
 */

const defaultPage = Page =>
  class DefaultPage extends React.Component<any> {
    static getInitialProps(ctx: Context) {
      // Check if it actually is a next page
      return (
        typeof Page.getInitialProps === 'function' && Page.getInitialProps(ctx)
      );
    }

    componentDidMount() {
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

export default (Page: React.ComponentType<any>) =>
  defaultPage(withI18n(Page));
