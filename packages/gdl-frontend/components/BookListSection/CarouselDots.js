// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import React, { PureComponent } from 'react';
import styled from '@emotion/styled';
import { colors } from '../../style/theme';

const SIZE = 8;
const VISIBLE = 4;
const MARGIN = 1;

const DotContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  transition: all 0.5s ease;
  margin-right: 10px;
`;

const DotHolder = styled('div')`
  flex-shrink: 0;
  transition: transform 0.5s ease;
`;

const Dot = styled('div')`
  margin: ${MARGIN}px;
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: 50%;
  background-color: white;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: transform 0.5s ease;
  background-color: ${p => (p.active ? colors.default : '#bbbbbb')};
  transform: ${p => (p.big ? 'scale(1.0)' : 'scale(0.5)')};
`;

type Props = {
  current: number,
  length: number
};

export default class CarouselDots extends PureComponent<Props> {
  getTransform = () => {
    if (this.props.length - VISIBLE < this.props.current) {
      return `translateX(-${(this.props.length - (VISIBLE + 1)) *
        (SIZE + 2 * MARGIN)}px)`;
    } else {
      return `translateX(-${(this.props.current - (VISIBLE - 2)) *
        (SIZE + 2 * MARGIN)}px)`;
    }
  };

  getHolderWidth = () => {
    if (this.props.current < VISIBLE - 3) {
      return SIZE * VISIBLE + VISIBLE * MARGIN * 2;
    } else {
      return SIZE * (VISIBLE + 1) + (VISIBLE + 1) * MARGIN * 2;
    }
  };

  isBigDot = (start: number, end: number, index: number) => {
    const { length, current } = this.props;
    // The first dot should always be big if start pointer hasnt moved
    if (start === 0 && index === 0) return true;
    // Visible dots minus 1 should be small on initial pointers
    if (current < VISIBLE - 3 && index === VISIBLE - 1 && length !== VISIBLE)
      return false;
    // Check that the end dots should be big when you reach towards the end
    if (current > length - VISIBLE && index >= length - VISIBLE) return true;
    // Otherwise all dots inbetween start and end pointers are big dots
    return index > start && index < end;
  };

  render() {
    const { current, length } = this.props;
    // The start and end pointers shouldn't move unless current moves away from initial VISIBLE range
    const start = current < VISIBLE - 2 ? 0 : current - 2;
    const end = current < VISIBLE - 2 ? VISIBLE : current + 2;

    return (
      <DotContainer style={{ width: this.getHolderWidth() }}>
        {[...Array(length)].map((_, index) => (
          <DotHolder key={index} style={{ transform: this.getTransform() }}>
            <Dot
              active={current === index}
              big={this.isBigDot(start, end, index)}
            />
          </DotHolder>
        ))}
      </DotContainer>
    );
  }
}
