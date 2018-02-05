// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import Link from 'next/link';

import { setRedirectUrl } from '../lib/auth';
import type { Context } from '../types';
import Box from '../components/Box';
import defaultPage from './defaultPage';
import Layout from '../components/Layout';
import Container from '../components/Container';

/**
 * The trans component doesn't handle nested chilren very well, so by extracting to own component, we can safely use link inside <Trans />
 */
const TransLink = ({ children, ...props }) => (
  <Link {...props}>
    <a>{children}</a>
  </Link>
);

/**
 * A HoC that ensures users are authenticated before displaying content
 */
const securePageHoc = Page =>
  class SecurePage extends React.Component<any> {
    static getInitialProps(ctx: Context) {
      return (
        typeof Page.getInitialProps === 'function' && Page.getInitialProps(ctx)
      );
    }

    componentDidMount() {
      setRedirectUrl({
        pathname: this.props.url.pathname,
        asPath: this.props.url.asPath
      });
    }

    render() {
      if (!this.props.isAuthenticated) {
        return (
          <Layout crumbs={[<Trans>Login required</Trans>]}>
            <Container pt={50}>
              <Box textAlign="center">
                <Trans>
                  Please{' '}
                  <TransLink href="/auth/sign-in" prefetch>
                    login
                  </TransLink>{' '}
                  to continue.
                </Trans>
              </Box>
            </Container>
          </Layout>
        );
      }
      return <Page {...this.props} />;
    }
  };

export default (Page: React.ComponentType<any>) =>
  defaultPage(securePageHoc(Page));
