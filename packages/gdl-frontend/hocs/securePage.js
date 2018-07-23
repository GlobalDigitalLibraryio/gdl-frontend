// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import Router, { withRouter } from 'next/router';

import {
  getTokenFromLocalCookie,
  getTokenFromServerCookie,
  hasClaim
} from '../lib/auth/token';
import { setRedirectUrl } from 'gdl-auth';
import type { Context } from '../types';
import Layout from '../components/Layout';
import NoAccessPage from '../components/NoAccessPage';
import Container from '../components/Container';

/**
 * A HoC that ensures users are authenticated before displaying content
 */
const securePageHoc = (Page, options) => {
  const { claim } = options;

  return class SecurePage extends React.Component<any> {
    static async getInitialProps(ctx: Context) {
      const token = ctx.req
        ? getTokenFromServerCookie(ctx.req)
        : getTokenFromLocalCookie();
      const isAuthenticated = Boolean(token);

      const hasAccess = claim
        ? isAuthenticated && hasClaim(claim, ctx.req)
        : true;

      // If we're on the server, is authenticated and don't have access, we return 403
      if (ctx.res != null && isAuthenticated && !hasAccess) {
        ctx.res.statusCode = 403;
      }

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps;
      // Check if it actually is a next page
      if (typeof Page.getInitialProps === 'function') {
        composedInitialProps = await Page.getInitialProps(ctx);
      }

      return {
        isAuthenticated,
        hasAccess,
        ...composedInitialProps
      };
    }

    /**
     * If we aren't authenticated, automatically redirect to the login page on mount
     */
    componentDidMount() {
      if (!this.props.isAuthenticated) {
        setRedirectUrl({
          pathname: this.props.router.pathname,
          asPath: this.props.router.asPath,
          query: this.props.router.query
        });
        Router.replace('/auth/sign-in');
      }
    }

    render() {
      if (!this.props.isAuthenticated) {
        return (
          <Layout>
            <Container pt={50}>
              <div css={{ textAlign: 'center' }}>
                <Trans>
                  Login required. Please wait while we redirect you.
                </Trans>
              </div>
            </Container>
          </Layout>
        );
      } else if (!this.props.hasAccess) {
        return <NoAccessPage />;
      }
      return <Page {...this.props} />;
    }
  };
};

export default (
  Page: React.ComponentType<any>,
  options: { claim?: string } = {}
) => withRouter(securePageHoc(Page, options));
