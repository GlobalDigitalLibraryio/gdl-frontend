// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import NotFoundPage from '../components/NotFound';
import type { Context } from '../types';

import UnexpectedError from '../components/UnexpectedError';
import NoAccessPage from '../components/NoAccessPage';
import Raven from '../lib/raven';

type Props = {
  statusCode: ?number
};

class ErrorPage extends React.Component<Props> {
  static getInitialProps({ req, res, err }: Context) {
    // $FlowFixMe Flow apparently doesn't like statusCode on the err object..
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;

    // SSR doesn't do componentDidCatch (_app.js), so for the server we do special handling for Sentry here
    if (req && err != null) {
      Raven.captureException(err, {
        // Tag the exception with the URL so we know where the error occurred
        tags: {
          url: `${req.protocol}://${req.headers.host}${req.originalUrl}`
        }
      });
    }

    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    if (statusCode === 404) {
      return <NotFoundPage />;
    } else if (statusCode === 403) {
      return <NoAccessPage />;
    }
    return <UnexpectedError />;
  }
}

export default ErrorPage;
