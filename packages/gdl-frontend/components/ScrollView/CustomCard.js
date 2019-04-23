// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css } from '@emotion/core';
import { Card } from '@material-ui/core';

import media from '../../style/media';
import { coverWidths } from './coverWidths';

/**
 * Adds an absolute anchor above the whole cover, so you can click anywhere.
 * It is hidden from screen readers and when using the keyboard, in that case the title is also a link.
 */
export default (props: any) => <Card css={cardCss} {...props} />;

/**
 * Add small brightness effect to book cover when hovered
 */
const cardCss = css`
  position: relative;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    img {
      transition: 1s opacity linear;
      pointer-events: none;
      filter: opacity(0.9);
    }
  }
  width: ${coverWidths.small}px;
  ${media.tablet`
    width: ${coverWidths.large}px;
  `};
`;
