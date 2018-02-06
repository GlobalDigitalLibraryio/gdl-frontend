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

import { setRedirectUrl } from '../lib/auth';
import type { Context } from '../types';
import Box from '../components/Box';
import defaultPage from './defaultPage';
import Layout from '../components/Layout';
import Container from '../components/Container';

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

    /**
     * If we aren't authenticated, automatically redirect to the login page on mount
     */
    componentDidMount() {
      if (!this.props.isAuthenticated) {
        setRedirectUrl({
          pathname: this.props.url.pathname,
          asPath: this.props.url.asPath
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
      }
      return <Page {...this.props} />;
    }
  };

export default (Page: React.ComponentType<any>) =>
  defaultPage(securePageHoc(Page));
