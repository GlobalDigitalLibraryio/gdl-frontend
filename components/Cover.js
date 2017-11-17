// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'styled-components';
import * as React from 'react';
import { width } from 'styled-system';
import height from './helpers/height';

const NO_COVER_PLACEHOLDER_URL = '/static/placeholder-cover.png';

const Div = styled('div')`
  ${width} ${height}
  background-image: url(${p => p.src});
  background-position: center center;
  background-size: cover;
  img {
    opacity: 0;
  }

  @supports (object-fit: cover) {
    background-image: none;

    img {
      opacity: 1;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
`;

/**
 * Neat little cover component that maintains the aspect ratio of the image, while filling the entire content box
 * With fallback support for IE
 */
const Cover = ({
  src,
  w,
  h,
}: {
  src: ?string,
  h: Array<number> | string,
  w: Array<number> | string,
}) => {
  const srcOrAlt = src || NO_COVER_PLACEHOLDER_URL;
  return (
    <Div w={w} h={h} src={src}>
      <img src={srcOrAlt} alt="" aria-hidden />
    </Div>
  );
};

export default Cover;
