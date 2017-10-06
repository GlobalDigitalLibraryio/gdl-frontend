// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */
import * as React from 'react';
import styled from 'styled-components';
import { CardBase } from './Card';
import type { Book } from '../types';

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const NO_COVER_PLACEHOLDER_URL = '/static/placeholder-cover.png';

const Card = CardBase.extend`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BookCover = ({ book, ...props }: { book: Book }) => (
  <Card bg="#f8f8f8" {...props}>
    <Img
      src={book.coverPhoto ? book.coverPhoto.small : NO_COVER_PLACEHOLDER_URL}
      alt={book.title}
      aria-hidden
    />
  </Card>
);

BookCover.defaultProps = {
  h: ['185px', '225px'],
  w: ['150px', '200px'],
};

export { BookCover as default, NO_COVER_PLACEHOLDER_URL };
