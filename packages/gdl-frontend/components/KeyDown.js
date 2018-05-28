// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

type Props = {
  when: string,
  then(event: KeyboardEvent): void,
  disabled?: boolean
};

export default class KeyDown extends React.Component<Props> {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (!this.props.disabled && event.key === this.props.when) {
      this.props.then(event);
    }
  };

  render() {
    return null;
  }
}
