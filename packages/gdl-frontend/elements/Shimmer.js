// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { css } from '@emotion/core';
import ContentLoader from 'react-content-loader';

import media from '../style/media';
import { COLUMN_GAP } from './Scroller';
import { coverWidths } from '../components/ScrollView/coverWidths';

const shimmerStyle = css`
  &:last-child {
    margin-right: ${coverWidths.large - coverWidths.small}px;
  }
  width: ${coverWidths.small}px;
  ${media.tablet`
  width: ${coverWidths.large}px;
`};
`;

/**
 * For browsers that doesn't support grid we add some spacing around the book covers
 */
export const itemStyle = css`
  display: inline-block;
  &:not(:last-child) {
    margin-right: ${COLUMN_GAP}px;
  }
  @supports (display: grid) {
    margin-right: 0 !important;
  }
`;

export default () => (
  <div css={[itemStyle, shimmerStyle]}>
    <ContentLoader className={shimmerStyle} height="200" width="130" speed={3}>
      <rect x="0" y="0" rx="0" ry="0" height="160" width="130" />
      <rect x="0" y="162" rx="0" ry="0" height="40" width="130" />
    </ContentLoader>
  </div>
);
