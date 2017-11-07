// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

type Props = {
  children: React.Element<any>,
  onTap(event: SyntheticTouchEvent<>): void,
};

const TAP_TOLERANCE = 10;

export default class OnTouch extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.touchStarted = false;
    this.touchMoved = false;
    this.startX = 0;
    this.startY = 0;
  }

  startX: number;
  startY: number;
  touchStarted: boolean;
  touchMoved: boolean;

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
        Math.abs(this.startX - currentX) > TAP_TOLERANCE ||
        Math.abs(this.startY - currentY) > TAP_TOLERANCE;
    }
  };

  handleTouchCancel = () => {
    this.touchStarted = false;
    this.touchMoved = false;
  };

  render() {
    return React.cloneElement(this.props.children, {
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd,
      onTouchMove: this.handleTouchMove,
      onTouchCancel: this.handleTouchCancel,
    });
  }
}
