// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import NotFound from '../components/NotFound';
import type { Context } from '../types';
import defaultPage from '../hocs/defaultPage';
import UnexpectedError from '../components/UnexpectedError';
import NoAccessPage from '../components/NoAccessPage';
import Raven from '../lib/raven';

type Props = {
  statusCode: ?number
};

const NotFoundPage = defaultPage(NotFound);

class ErrorPage extends React.Component<Props> {
  static getInitialProps({ res, err }: Context) {
    // We only send errors to Sentry if they actually are errors
    // Poor man's way of only sending the error once.
    // If the error occurred during SSR, the client gets an  err as a POJO,
    // and we don't want to capture that since we've already done so on the server
    if (err && err instanceof Error) {
      Raven.captureException(err);
    }
    // $FlowFixMe Flow apparently doesn't like statusCode on the err object..
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
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
