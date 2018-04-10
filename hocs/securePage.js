// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import Router from 'next/router';

import {
  getTokenFromLocalCookie,
  getTokenFromServerCookie,
  hasClaim
} from '../lib/auth/token';
import { setRedirectUrl } from '../lib/auth';
import type { Context } from '../types';
import Box from '../components/Box';
import defaultPage from './defaultPage';
import Layout from '../components/Layout';
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
      console.log('CLAIM', claim);

      const hasAccess = claim
        ? isAuthenticated && hasClaim(claim, ctx.req)
        : true;

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
          pathname: this.props.url.pathname,
          asPath: this.props.url.asPath,
          query: this.props.url.query
        });
        Router.replace('/auth/sign-in');
      }
    }

    render() {
      if (!this.props.isAuthenticated) {
        return (
          <Layout>
            <Container pt={50}>
              <Box textAlign="center">
                <Trans>
                  Login required. Please wait while we redirect you.
                </Trans>
              </Box>
            </Container>
          </Layout>
        );
      } else if (!this.props.hasAccess) {
        return <div>Hell no</div>;
      }
      return <Page {...this.props} />;
    }
  };
};

export default (
  Page: React.ComponentType<any>,
  options: { claim?: string } = {}
) => defaultPage(securePageHoc(Page, options));
