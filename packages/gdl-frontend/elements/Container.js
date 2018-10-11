// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { fluidRange } from 'polished';
import styled, { cx, css } from 'react-emotion';

import View from './View';
import { misc } from '../style/theme';

/**
 * Center content horizontally
 */
// FIXME: Currently margin left/right here overwrites any specific margin passed to <View /> :/
const StyledContainer = styled(View)`
  margin-left: auto;
  margin-right: auto;
  max-width: ${p => `${misc.containers[p.size]}px`};
`;

type Props = {
  className?: string,
  gutter: boolean,
  size: $Keys<typeof misc.containers>
};

const Container = ({ className, gutter, size, ...props }: Props) => (
  <StyledContainer
    className={cx(
      {
        [smallGutterStyle]: gutter === true && size === 'small',
        [largeGutterStyle]: gutter === true && size === 'large'
      },
      className
    )}
    size={size}
    {...props}
  />
);

Container.defaultProps = {
  size: 'small',
  gutter: true
};

/**
 * Fluid gutter via media queries.
 * If the viewport is small enough, we have gutter that is via padding only.
 * If the viewport is large enough, there is no need for gutter padding at all.
 * Then there is the area between, we use a linear function to approximate the gutter size as a mix
 * of the padding and margin.
 */
const gutterFunc = containerSize =>
  fluidRange(
    [
      {
        prop: 'padding-left',
        fromSize: `${misc.gutter}px`,
        toSize: '0px'
      },
      {
        prop: 'padding-right',
        fromSize: `${misc.gutter}px`,
        toSize: '0px'
      }
    ],
    `${containerSize}px`,
    `${containerSize + 2 * misc.gutter}px`
  );

const smallGutterStyle = css`
  ${gutterFunc(misc.containers.small)};
`;

const largeGutterStyle = css`
  ${gutterFunc(misc.containers.large)};
`;

export default Container;
