// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import NextApp, { Container as NextContainer } from 'next/app';
import Error from 'next/error';
import type { $Request, $Response } from 'express';

import { hasClaim, claims } from 'gdl-auth';

type Context = {
  req?: $Request,
  res?: $Response
};

class App extends NextApp {
  /**
   * Make sure the user actually has admin access
   */
  static async getInitialProps({
    Component,
    ctx
  }: {
    Component: React.ComponentType<*>,
    ctx: Context
  }) {
    let pageProps = {};

    if (typeof Component.getInitialProps === 'function') {
      pageProps = await Component.getInitialProps(ctx);
    }

    const userHasAdminPrivileges = hasClaim(claims.readAdmin, ctx.req);

    // If we have response object, set a proper HTTP status code
    if (!userHasAdminPrivileges && ctx.res) {
      ctx.res.statusCode = 403;
    }

    return { pageProps, userHasAdminPrivileges };
  }

  render() {
    const { Component, userHasAdminPrivileges, pageProps } = this.props;

    const Page = userHasAdminPrivileges ? (
      <Component {...pageProps} />
    ) : (
      <Error statusCode={403} {...pageProps} />
    );

    return <NextContainer>{Page}</NextContainer>;
  }
}

export default App;
