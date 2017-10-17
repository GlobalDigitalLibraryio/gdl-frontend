// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */
import * as React from 'react';
import styled from 'styled-components';
import Box from './Box';
import type { Book } from '../types';

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const Cover = Box.extend`
  border-radius: 4px;
  background-color: ${props => props.theme.grays.desertStorm};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NO_COVER_PLACEHOLDER_URL = '/static/placeholder-cover.png';

const BookCover = ({ book, ...props }: { book: Book }) => (
  <Cover {...props}>
    <Img
      src={book.coverPhoto ? book.coverPhoto.small : NO_COVER_PLACEHOLDER_URL}
      alt={book.title}
      aria-hidden
    />
  </Cover>
);

BookCover.defaultProps = {
  h: ['185px', '225px'],
  w: ['150px', '200px'],
};

export { BookCover as default, NO_COVER_PLACEHOLDER_URL };
