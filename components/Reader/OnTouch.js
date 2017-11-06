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
  onTap(event: SyntheticTouchEvent<>): void,
};

export default class OnTouch extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.touchStarted = false;
    this.touchMoved = false;
    this.startX = 0;
    this.startY = 0;
  }

  handleTouchStart = (event: SyntheticTouchEvent<>) => {
    this.touchStarted = true;
    this.touchMoved = false;
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
  };

  handleTouchEnd = (event: SyntheticTouchEvent<>) => {
    this.touchStarted = false;
    if (!this.touchMoved) {
      this.props.onTap(event);
    }
  };

  handleTouchMove = (event: SyntheticTouchEvent<>) => {
    if (!this.touchMoved) {
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;

      this.touchMoved =
        Math.abs(this.startX - currentX) > 10 ||
        Math.abs(this.startY - currentY) > 10;
    }
  };

  handleTouchCancel = () => {
    this.touchStarted = false;
    this.touchMoved = false;
  };

  render() {
    const children = React.Children.only(this.props.children);
    return React.cloneElement(children, {
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd,
      onTouchMove: this.handleTouchMove,
      onTouchCancel: this.handleTouchCancel,
    });
  }
}
