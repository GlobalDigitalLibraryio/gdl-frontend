// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';

type Props = {
  children: (data: { loading: boolean }) => Node,
  loading: boolean,
  timeout: number
};

type State = {
  loading: boolean
};

/**
 * A utility component that delays a boolean value until after a certian threshold / timeout is passed.
 * This is because it breaks the user's flow if a spinner or something is "flashed" in the user's face.
 *
 * This component is useful to render a loading spinner only if the a request takes longer than 1 seconds.
 */
class DelayedLoading extends React.Component<Props, State> {
  static defaultProps = {
    timeout: 1000
  };

  state = {
    loading: false
  };

  timer = null;

  componentDidMount() {
    if (this.props.loading) {
      this.startTimer();
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.loading && !props.loading) {
      return { loading: false };
    }
    return null;
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.loading && !prevProps.loading && !this.state.loading) {
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  startTimer() {
    this.timer = setTimeout(
      () => this.setState({ loading: true }),
      this.props.timeout
    );
  }

  render() {
    return this.props.children({
      loading: this.state.loading
    });
  }
}

export default DelayedLoading;
