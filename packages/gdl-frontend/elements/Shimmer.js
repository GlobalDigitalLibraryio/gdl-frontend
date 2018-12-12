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
    height: ['130px', '160px']
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
        size={size}
        {...props}
      />
    ))
  ) : (
    <ComposedShimmer height={sizesMap[size].height} width={widths} {...props} />
  );
};

const ComposedShimmer = ({ ...props }: Props) => (
  <ShimmerPlaceholder {...props}>
    <Base>
      <PicturePlaceholder {...props} />
      <First {...props} />
      <Second {...props} />
      <Third {...props} />
      <Fourth {...props} />
      <Fifth {...props} />
      <Sixth {...props} />
      <Seventh {...props} />
      <Eighth {...props} />
      <Ninth {...props} />
      <Tenth {...props} />
      <Eleventh {...props} />
      <Twelfth {...props} />
      <Thirteenth {...props} />
    </Base>
  </ShimmerPlaceholder>
);

/** Shimmer setup.. */

const Base = styled('div')`
  height: 70%;
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

const PicturePlaceholder = styled('div')`
  height: ${p => (p.size === 'large' ? '78' : '40')}px !important;
  left: ${p => (p.size === 'large' ? '88' : '40')}px !important;
  right: auto !important;
  top: 0 !important;
  width: 10px;
`;

const First = styled('div')`
  height: 8px !important;
  left: ${p => (p.size === 'large' ? '88' : '48')}px !important;
  top: ${p => (p.size === 'large' ? '0' : '0')}px !important;
`;

const Second = styled('div')`
  height: 8px !important;
  left: ${p => (p.size === 'large' ? '88' : '48')}px !important;
  top: 0px !important;
`;

const Third = styled('div')`
  left: ${p => (p.size === 'large' ? '236' : '136')}px !important;
  top: 8px !important;
`;

const Fourth = styled('div')`
  height: 12px !important;
  left: ${p => (p.size === 'large' ? '88' : '48')}px !important;
  top: 14px !important;
`;

const Fifth = styled('div')`
  left: ${p => (p.size === 'large' ? '200' : '100')}px !important;
  top: 26px !important;
`;

const Sixth = styled('div')`
  height: 10px !important;
  left: ${p => (p.size === 'large' ? '88' : '48')}px !important;
  top: 32px !important;
`;

const Seventh = styled('div')`
  height: ${p => (p.size === 'large' ? '20' : '20')}px !important;
  top: 40px !important;
  left: ${p => (p.size === 'large' ? '98' : '0')}px !important;
`;

const Eighth = styled('div')`
  top: 60px !important;
  left: ${p => (p.size === 'large' ? '128' : '410')}px !important;
`;

const Ninth = styled('div')`
  height: 13px !important;
  top: 66px !important;
`;

const Tenth = styled('div')`
  left: 236px !important;
  top: 79px !important;
`;

const Eleventh = styled('div')`
  height: 13px !important;
  top: 85px !important;
`;

const Twelfth = styled('div')`
  top: 98px !important;
  left: ${p => (p.size === 'large' ? '288' : '410')}px !important;
`;

const Thirteenth = styled('div')`
  top: 105px !important;
  height: ${p => (p.size === 'large' ? '100' : '10')}px !important;
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
  ${p =>
    mq({
      height: p.size === 'small' ? p.height : p.height,
      width: p.size === 'small' ? p.width : p.width,
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
