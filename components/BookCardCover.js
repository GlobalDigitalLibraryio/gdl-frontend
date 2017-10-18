// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import { Trans } from 'lingui-react';
import { responsiveStyle } from 'styled-system';
import type { Book } from '../types';
import { NO_COVER_PLACEHOLDER_URL } from './BookCover';
import BoxBase from './Box';
import CardBase from './Card';
import ReadingLevel from './ReadingLevel';

const Card = CardBase.extend`
  text-align: center;
  border-radius: 0 0 4px 4px;
  color: ${props => props.theme.grays.dark};
  overflow: hidden;
`;

Card.defaultProps = {
  fontSize: [11, 14],
  px: 5,
  py: '2px',
};

const Box = BoxBase.extend`
  text-decoration: none;
`;

// The wrapper for the book image
const Cover = styled.div`
  ${responsiveStyle('height', 'h')} width: 100%;
  background-color: ${props => props.theme.grays.desertStorm};
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

const BookTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
`;

export default ({ book, ...props }: { book: Book }) => (
  <Box w={[105, 130]} style={{ flexShrink: 0 }} {...props}>
    <Cover h={['130px', '160px']}>
      <Img
        src={book.coverPhoto ? book.coverPhoto.small : NO_COVER_PLACEHOLDER_URL}
        alt={book.title}
        aria-hidden
      />
    </Cover>
    <Card h={['50px', '53px']}>
      <BookTitle>{book.title}</BookTitle>
      <ReadingLevel>
        <Trans id="level">Level {book.readingLevel}</Trans>
      </ReadingLevel>
    </Card>
  </Box>
);
