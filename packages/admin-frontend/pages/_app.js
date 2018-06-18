// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import NextApp, { Container as NextContainer } from 'next/app';
import { checkClaim } from '../../gdl-auth';

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    console.log('hello from render!');
    const { Component, pageProps } = this.props;
    return (
      <NextContainer>
        <Component {...pageProps} />
      </NextContainer>
    );
  }
}

export default App;
