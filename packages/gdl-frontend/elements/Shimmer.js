// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled, { keyframes } from 'react-emotion';
import mq from '../style/mq';

type Props = {
  columns?: number,
  // 'small' is default, large could be used to larger book covers
  size?: 'small' | 'large'
};

const sizesMap = {
  small: {
    width: ['105px', '130px'],
    height: ['170px', '200px']
  },
  large: {
    width: ['180px', '310px'],
    height: ['220px', '380px']
  }
};

const Shimmer = ({ columns, size = 'small', ...props }: Props) => {
  const widths = sizesMap[size].width;

  // Creates an array representing the number of 'columns' given to hold shimmers
  const arrayOfPlaceholders = Array.from(Array(columns).keys()) || null;

  return arrayOfPlaceholders ? (
    arrayOfPlaceholders.map(column => (
      <ComposedShimmer
        key={column}
        height={sizesMap[size].height}
        width={widths}
        {...props}
      />
    ))
  ) : (
    <ComposedShimmer height={sizesMap[size].height} width={widths} {...props} />
  );
};

const ComposedShimmer = ({ ...props }: Props) => (
  <ShimmerPlaceholder {...props}>
    <ShimmerFiller />
  </ShimmerPlaceholder>
);

/******** Shimmer setup.. **********/

const ShimmerFiller = styled('div')`
  height: 100%;
  width: 100%;
  position: relative;
  > ${this} div {
    background: #fff;
    position: absolute;
    height: 15px;
    left: 0%;
    right: 0%;
  }
`;

const shimmerAnimation = keyframes`
  0% {
    background-position: -100px 0;
  }
  100% {
    background-position: 100px 0;
  }
`;

const ShimmerPlaceholder = styled('div')`
  position: relative;
  background: #f6f7f9;
  background-image: linear-gradient(
    to right,
    #f6f7f9 0%,
    #e9ebee 20%,
    #f6f7f9 40%,
    #f6f7f9 100%
  );
  background-repeat: no-repeat;
  height: 210px;
  width: 130px;
  ${p =>
    mq({
      height: p.height,
      width: p.width,
      marginLeft: 'auto'
    })};
  animation-timing-function: linear;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${shimmerAnimation};
  -webkit-animation-timing-function: linear;
  -webkit-animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-name: ${shimmerAnimation};
`;

export default Shimmer;
