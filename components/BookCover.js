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
import type { CoverPhoto } from '../types';
import theme from '../style/theme';

type Props = {
  coverPhoto: ?CoverPhoto,
  w: Array<string | number>,
  h: Array<string | number>
};

const style = css`
  position: relative;
  box-shadow: ${theme.boxShadows.small};
`;

const BookCover = ({ coverPhoto, w, h }: Props) => (
  <CoverImage
    className={style}
    src={coverPhoto && coverPhoto.large}
    h={h}
    w={w}
  />
);

export default BookCover;
