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

import { setRedirectUrl, getAuthToken } from 'gdl-auth';
import type { Context } from '../types';
import Layout from '../components/Layout';
import Container from '../elements/Container';

/**
 * A HoC that ensures users are authenticated before displaying content
 */
const securePageHoc = Page => {
  return class SecurePage extends React.Component<any> {
    static async getInitialProps(ctx: Context) {
      const isAuthenticated = Boolean(getAuthToken(ctx.req));
      // Evaluate the composed component's getInitialProps()
      let composedInitialProps;
      // Check if it actually is a next page
      // $FlowFixMe: Next static method on the React component type
      if (typeof Page.getInitialProps === 'function') {
        composedInitialProps = await Page.getInitialProps(ctx);
      }

      return {
        isAuthenticated,
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
      }
      return <Page {...this.props} />;
    }
  };
};

export default (Page: React.ComponentType<any>) =>
  withRouter(securePageHoc(Page));
