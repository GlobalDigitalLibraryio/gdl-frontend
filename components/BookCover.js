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
import type { Book } from '../types';
import theme from '../style/theme';

type Props = {
  book: Book
};

const style = css`
  position: relative;
  box-shadow: ${theme.boxShadows.small};
`;

const BookCover = ({ book }: Props) => (
  <CoverImage
    className={style}
    src={book.coverPhoto && book.coverPhoto.large}
    h="100%"
    w="100%"
  />
);

export default BookCover;
