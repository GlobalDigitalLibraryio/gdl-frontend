// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */
import * as React from 'react';
import { css } from 'styled-components';
import { CardBase } from './Card';
import media from './helpers/media';
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

const Cover = CardBase.extend`
  ${coverCss};
  ${props =>
    props.isHiddenMobile &&
    css`
      display: none;
      ${media.tablet`
      display: flex;
    `};
    `};
  ${props =>
    props.isHiddenTablet &&
    media.tablet`
      display: none;
    `};
`;

const BookCover = ({
  book,
  ...props
}: {
  book: Book,
  // Escape hatches for responsive layout
  isHiddenTablet?: boolean,
  isHiddenMobile?: boolean,
}) => (
  <Cover {...props}>
    <Img src={book.coverPhoto && book.coverPhoto.small} alt={book.title} />
  </Cover>
);

BookCover.defaultProps = {
  h: ['185px', '255px'],
  w: ['150px', '200px'],
};

export { BookCover as default, coverCss };
