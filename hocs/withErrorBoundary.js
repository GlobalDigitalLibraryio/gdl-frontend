// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import type { Context } from '../types';

/**
 * A higher order component that acts as an error boundary
 */
export default (Page: React.ComponentType<any>) =>
  class PageWithEnv extends React.Component<{}> {
    static async getInitialProps(context: Context) {
      // Evaluate the composed component's getInitialProps()
      let composedInitialProps;
      // Check if it actually is a next page
      if (typeof Page.getInitialProps === 'function') {
        composedInitialProps = await Page.getInitialProps(context);
      }

      return composedInitialProps;
    }

    render() {
      return (
        <ErrorBoundary>
          <Page {...this.props} />
        </ErrorBoundary>
      );
    }
  };
