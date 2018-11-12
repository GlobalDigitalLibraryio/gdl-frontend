// @flow
import * as React from 'react';

import OnlineStatus from '../components/OnlineStatus';
import offlineLibrary from '../lib/offlineLibrary';
import OfflinePage from '../pages/offline';
import ErrorPage from '../pages/_error';
import type { Context } from '../types';

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

      if (!statusCode || statusCode === 200) {
        return <Page {...this.props} />;
      } else if (statusCode === 404) {
        return <ErrorPage statusCode={statusCode} />;
      }

      /**
       * If we're here, and we are on the client, we check if we are offline and then render the offline page instead.
       * As long as the error code wasn't a 404 (handled in previous check) it is likely that the network was down
       * or something similar, which triggers a string of errors and we end up here.
       */

      return (
        <OnlineStatus>
          {online =>
            !online && offlineLibrary ? (
              <OfflinePage />
            ) : (
              <ErrorPage statusCode={statusCode} />
            )
          }
        </OnlineStatus>
      );
    }
  };
