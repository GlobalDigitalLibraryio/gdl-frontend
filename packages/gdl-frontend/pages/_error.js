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

type Props = {
  statusCode: ?number
};

class ErrorPage extends React.Component<Props> {
  static getInitialProps({ res, err }: Context) {
    // $FlowFixMe Flow apparently doesn't like statusCode on the err object..
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;

    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    if (statusCode === 404) {
      return <NotFoundPage />;
    }
    return <UnexpectedError />;
  }
}

export default ErrorPage;
