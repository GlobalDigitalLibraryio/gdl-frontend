// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import ErrorComp from './Error';

type Props = {
  children: React.Node,
};

type State = {
  error: ?Error,
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state = {
    error: null,
  };

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return <ErrorComp statusCode={500} />;
    }
    return this.props.children;
  }
}
