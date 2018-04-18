// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { css, keyframes, cx } from 'react-emotion';

import { colors } from '../style/theme';
import View, { type Props as ViewProps } from './View';

const indicatorSizes = {
  small: {
    width: 20,
    height: 20
  },
  large: {
    width: 36,
    height: 36
  }
};

type Props = {
  ...ViewProps,
  animating: true,
  color: string,
  hidesWhenStopped: true,
  size: $Keys<typeof indicatorSizes> | number
};

const createSvgCircle = style => (
  <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={style} />
);

const ActivityIndicator = ({
  animating,
  color,
  hidesWhenStopped,
  size,
  ...props
}: Props) => {
  const svg = (
    <svg height="100%" viewBox="0 0 32 32" width="100%">
      {createSvgCircle({
        stroke: color,
        opacity: 0.2
      })}
      {createSvgCircle({
        stroke: color,
        strokeDasharray: 80,
        strokeDashoffset: 60
      })}
    </svg>
  );

  return (
    <View
      accessibilityRole="progressbar"
      aria-valuemax="1"
      aria-valuemin="0"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <View
        children={svg}
        className={cx(animationClass, {
          [animationPauseClass]: !animating,
          [hidesWhenStoppedClass]: !animating && hidesWhenStopped
        })}
        style={
          typeof size === 'number'
            ? { height: size, width: size }
            : indicatorSizes[size]
        }
      />
    </View>
  );
};

ActivityIndicator.defaultProps = {
  animating: true,
  color: colors.button.defaultBackground,
  hidesWhenStopped: true,
  size: 'small'
};

const animationName = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const animationClass = css`
  animation: ${animationName} 0.75s linear infinite;
`;

const animationPauseClass = css`
  animation-play-state: paused;
`;

const hidesWhenStoppedClass = css`
  visibility: hidden;
`;

export default ActivityIndicator;
