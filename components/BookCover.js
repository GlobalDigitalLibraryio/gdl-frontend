// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'styled-components';
import Card from './Card';
import CoverImage from './CoverImage';
import type { Book } from '../types';
import { flexCenter } from '../style/flex';

// Export css for reuse for book cover with title and and reading level
/* const coverCss = css`
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

export { BookCover as default, coverCss }; */

type Props = {
  book: Book,
};

const Frame = styled(Card)`
  ${flexCenter};
  width: 100%;
  height: 100%;
`;

const BookCover = ({ book }: Props) => (
  <Frame p={[5, 10]}>
    <CoverImage
      src={book.coverPhoto && book.coverPhoto.large}
      h="100%"
      w="100%"
    />
  </Frame>
);

export default BookCover;
