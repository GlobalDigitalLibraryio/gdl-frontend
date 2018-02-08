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
  coverPhoto: ?CoverPhoto
};

const style = css`
  position: relative;
  box-shadow: ${theme.boxShadows.small};
`;

const BookCover = ({ coverPhoto }: Props) => (
  <CoverImage
    className={style}
    src={coverPhoto && coverPhoto.large}
    h="100%"
    w="100%"
  />
);

export default BookCover;
