// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import { responsiveStyle } from 'styled-system';
import type { Book } from '../types';
import { NO_COVER_PLACEHOLDER_URL } from './BookCover';
import BoxBase from './Box';
import CardBase from './Card';

const Card = CardBase.extend`
  text-align: center;
  border-radius: 0 0 4px 4px;
  color: #444;
  line-height: 14px;
  overflow: hidden;
`;

Card.defaultProps = {
  fontSize: [12, 14],
  px: 5,
  py: '2px',
};

const Box = BoxBase.extend`text-decoration: none;`;

// The wrapper for the book image
const Cover = styled.div`
  ${responsiveStyle('height', 'h')} width: 100%;
  background-color: #f8f8f8;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Img = styled.img`
  max-height: 100%;
  max-width: 100%;
`;

export default ({ book, ...props }: { book: Book }) => (
  <Box
    w={[105, 130]}
    h={['164px', '204px']}
    mx={5}
    style={{ flexShrink: 0 }}
    {...props}
  >
    <Cover h={['130px', '160px']}>
      <Img
        src={book.coverPhoto ? book.coverPhoto.small : NO_COVER_PLACEHOLDER_URL}
        alt={book.title}
        aria-hidden
      />
    </Cover>
    <Card h={['34px', '44px']}>{book.title}</Card>
  </Box>
);
