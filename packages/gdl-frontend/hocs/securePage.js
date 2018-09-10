// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Router from 'next/router';

import { getAuthToken } from 'gdl-auth';
import type { Context } from '../types';

/**
 * A HoC that ensures users are authenticated
 */
const securePageHoc = Page => {
  return class SecurePage extends React.Component<any> {
    static async getInitialProps(ctx: Context) {
      const isAuthenticated = Boolean(getAuthToken(ctx.req));

      // If we aren't authenticated we redirect to the login page
      if (!isAuthenticated) {
        // We have different ways of redirecting on the server and on the client...
        // See https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
        if (ctx.res) {
          ctx.res.writeHead(302, {
            Location: `/auth/sign-in?next=${encodeURIComponent(ctx.asPath)}`
          });
          // $FlowFixMe: We quickly end the response without any data
          ctx.res.end();
        } else {
          Router.replace({
            pathname: '/auth/sign-in',
            query: { next: ctx.asPath }
          });
        }
        return {};
      } else {
        return (
          // $FlowFixMe Flow doesn't approve of this method on the React component type
          typeof Page.getInitialProps === 'function' &&
          Page.getInitialProps(ctx)
        );
      }
    }

    render() {
      return <Page {...this.props} />;
    }
  };
};

export default (Page: React.ComponentType<any>) => securePageHoc(Page);
