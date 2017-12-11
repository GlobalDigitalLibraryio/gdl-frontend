// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import defaultPage from './defaultPage';
import { getAccessToken } from '../lib/auth/authHelpers';
import Layout from '../components/Layout';
import Container from '../components/Container';

const securePageHoc = Page =>
  class SecurePage extends React.Component<any> {
    static getInitialProps(ctx) {
      return Page.getInitialProps && Page.getInitialProps(ctx);
    }

    render() {
      if (!getAccessToken()) {
        return (
          <Layout>
            <Container>Please login to continue</Container>
          </Layout>
        );
      }
      return <Page {...this.props} />;
    }
  };

export default (Page: React.ComponentType<any>) =>
  defaultPage(securePageHoc(Page));
