// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Link from 'next/link';
import type { Context } from '../types';
import defaultPage from './defaultPage';
import { getPersonalToken } from '../lib/auth/token';
import Layout from '../components/Layout';
import Container from '../components/Container';

/**
 * A HoC that ensures users are authenticated before displaying content
 */
const securePageHoc = Page =>
  class SecurePage extends React.Component<any> {
    static async getInitialProps(ctx: Context) {
      const personalToken = getPersonalToken(ctx.req);
      const isAuthenticated = Boolean(personalToken);

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

    render() {
      if (!this.props.isAuthenticated) {
        return (
          <Layout>
            <Container pt={50}>
              Please{' '}
              <Link href="/auth/sign-in" prefetch>
                <a>login</a>
              </Link>{' '}
              to continue
            </Container>
          </Layout>
        );
      }
      return <Page {...this.props} />;
    }
  };

export default (Page: React.ComponentType<any>) =>
  defaultPage(securePageHoc(Page));
