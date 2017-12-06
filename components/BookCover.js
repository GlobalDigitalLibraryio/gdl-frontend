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
