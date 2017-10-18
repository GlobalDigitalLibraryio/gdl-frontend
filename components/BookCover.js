// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */
import * as React from 'react';
import { css } from 'styled-components';
import { CardNew } from './Card';
import Img from './Img';
import type { Book } from '../types';

// Export css for reuse for book cover with title and and reading level
const coverCss = css`
  background-color: ${props => props.theme.grays.desertStorm};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Cover = CardNew.extend`
  ${coverCss};
`;

const BookCover = ({ book, ...props }: { book: Book }) => (
  <Cover {...props}>
    <Img src={book.coverPhoto && book.coverPhoto.small} alt={book.title} />
  </Cover>
);

BookCover.defaultProps = {
  h: ['185px', '225px'],
  w: ['150px', '200px'],
};

export { BookCover as default, coverCss };
