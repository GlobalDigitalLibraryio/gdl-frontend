// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { css } from 'react-emotion';

import CoverImage from './CoverImage';
import type { CoverImageInfo } from '../types';
import misc from "../style/misc"

type Props = {
  coverImage: ?CoverImageInfo,
  w: Array<string | number>,
  h: Array<string | number>
};

const style = css`
  position: relative;
  box-shadow: ${misc.boxShadows.small};
`;

const BookCover = ({ coverImage, w, h }: Props) => (
  <CoverImage
    ariaHidden
    className={style}
    src={coverImage && coverImage.url}
    alt={coverImage && coverImage.alttext}
    h={h}
    w={w}
  />
);

export default BookCover;
