// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';

/**
 * A higher order component wthat injects environment props to pages
 * Use together with env.js
 */
export default (Page: React.ComponentType<any>) =>
  class PageWithEnv extends React.Component<{}> {
    static async getInitialProps(context) {
      // Evaluate the composed component's getInitialProps()
      let composedInitialProps;
      // Check if it actually is a next page
      if (typeof Page.getInitialProps === 'function') {
        composedInitialProps = await Page.getInitialProps(context);
      }

      return {
        ...composedInitialProps,
        env: {
          GDL_ENVIRONMENT: process.env.GDL_ENVIRONMENT,
        },
      };
    }

    render() {
      return <Page {...this.props} />;
    }
  };
