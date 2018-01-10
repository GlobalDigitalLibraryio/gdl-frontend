// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import type { Context } from '../types';
import defaultPage from '../hocs/defaultPage';
import ErrorComp from '../components/Error';

type Props = {
  statusCode: ?number
};

class Error extends React.Component<Props> {
  static async getInitialProps({ res, err }: Context) {
    let statusCode;
    if (res && res.statusCode) {
      statusCode = res.statusCode;
    } else if (err && err.statusCode) {
      statusCode = err.statusCode;
    }

    return {
      statusCode
    };
  }

  render() {
    const { statusCode } = this.props;
    return <ErrorComp statusCode={statusCode} />;
  }
}

const ErrorPage = defaultPage(Error, false);

export { Error, ErrorPage as default };
