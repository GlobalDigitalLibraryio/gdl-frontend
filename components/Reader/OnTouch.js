// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

type Props = {
  children: React.Node,
  onTouch(event: TouchEvent): void,
};

export default class OnTouch extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.touchStarted = false;
    this.currentX = 0;
    this.currentY = 0;
  }

  handleTouchStart = (event: TouchEvent) => {
    this.touchStarted = true;
  };

  handleTouchEnd = (event: TouchEvent) => {
    this.touchStarted = false;
    this.props.onTouch(event);
  };

  handleTouchCancel = () => {
    this.touchStarted = false;
  };

  render() {
    const children = React.Children.only(this.props.children);
    return React.cloneElement(children, {
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd,
      onTouchCancel: this.handleTouchCancel,
    });
  }
}
