// @flow
import * as React from 'react';
import ErrorPage from '../pages/_error';
import type { Context } from '../types';

export default (Page: React.ComponentType<*>) =>
  class extends React.Component<*> {
    static async getInitialProps(ctx: Context) {
      // $FlowFixMe This is okay, we're only wrapping other pages
      const props = await Page.getInitialProps(ctx);

      // On the server, get the status code from the response
      const resStatusCode = ctx.res && ctx.res.statusCode;

      // Get the statusCode from the wrapped page
      const { statusCode } = props;

      // If we're on the server, and the response status code doesn't match that of the wrapped component, we set it
      if (ctx.res && statusCode && ctx.res.statusCode !== statusCode) {
        ctx.res.statusCode = statusCode;
      }

      return { statusCode: resStatusCode, ...props };
    }

    render() {
      const { statusCode } = this.props;
      if (statusCode && statusCode !== 200) {
        return <ErrorPage statusCode={statusCode} />;
      }
      return <Page {...this.props} />;
    }
  };
