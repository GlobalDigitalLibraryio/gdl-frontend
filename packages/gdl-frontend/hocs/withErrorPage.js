// @flow
import * as React from 'react';
import dynamic from 'next/dynamic';
import { clientIsOffline, clientSupportsOffline } from '../lib/offline';
import ErrorPage from '../pages/_error';
import type { Context } from '../types';

const OfflinePage = dynamic(import('../pages/offline'), {
  ssr: false
});

export default (Page: React.ComponentType<*>) =>
  class extends React.Component<*> {
    static async getInitialProps(ctx: Context) {
      // $FlowFixMe This is okay, we're only wrapping other pages
      const props = await Page.getInitialProps(ctx);

      // On the server we get the statusCode from either the wrapped page's props or the response object
      const statusCode = ctx.res
        ? props.statusCode || ctx.res.statusCode
        : props.statusCode;

      // If we're on the server make sure the statusCode is the one set in a wrapped page
      if (ctx.res) {
        ctx.res.statusCode = statusCode;
      }

      return { ...props, statusCode };
    }

    render() {
      const { statusCode } = this.props;
      if (statusCode && statusCode !== 200) {
        return clientSupportsOffline() &&
          clientIsOffline() &&
          statusCode !== 404 ? (
          <OfflinePage />
        ) : (
          <ErrorPage statusCode={statusCode} />
        );
      }
      return <Page {...this.props} />;
    }
  };
