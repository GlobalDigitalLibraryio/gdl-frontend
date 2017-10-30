// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { Router } from '../routes';
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

  componentDidMount() {
    Router.onRouteChangeStart = this.handleRouteChangeStart;
  }

  componentWillUnmount() {
    Router.onChangeStart = null;
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  // If we're showing the error page, and the route changes, reset the error state
  // Allows us to navigate to landing page after the error
  handleRouteChangeStart = () => {
    if (this.state.error != null) {
      this.setState({ error: null });
    }
  };

  render() {
    if (this.state.error) {
      return <ErrorComp statusCode={500} />;
    }
    return this.props.children;
  }
}
