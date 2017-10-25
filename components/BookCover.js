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
import CoverImage from './CoverImage';
import type { Book } from '../types';
import theme from '../style/theme';

// Export css for reuse for book cover with title and and reading level
const coverCss = css`
  background-color: ${theme.colors.whiteTer};
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

type Props = {
  book: Book,
  // Escape hatches for responsive layout
  isHiddenTablet?: boolean,
  isHiddenMobile?: boolean,
  w?: string | number | Array<string | number>,
  h?: string | number | Array<string | number>,
};

const BookCover = ({ book, ...props }: Props) => (
  <Cover {...props}>
    <CoverImage
      src={book.coverPhoto && book.coverPhoto.large}
      h="100%"
      w="100%"
    />
  </Cover>
);

BookCover.defaultProps = {
  h: ['185px', '255px'],
  w: ['150px', '200px'],
};

export { BookCover as default, coverCss };
