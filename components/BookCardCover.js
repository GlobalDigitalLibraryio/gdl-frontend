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
import type { Book } from '../types';
import { CardBase } from './Card';
import ReadingLevel from './ReadingLevel';
import Img from './Img';
import Box from './Box';
import { coverCss } from './BookCover';

const Cover = Box.extend`
  ${coverCss};
`;

const Div = Box.extend`
  text-align: center;
  color: ${props => props.theme.grays.dark};
  border-top: 1px solid ${props => props.theme.grays.platinum};
  background-color: ${props => props.theme.grays.white};
`;

const BookTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
`;

// TODO: Figure out why box-shadow is clipped
export default ({ book, ...props }: { book: Book }) => (
  <CardBase
    w={[105, 130]}
    flex="0 0 auto"
    style={{ overflow: 'hidden', display: 'block' }}
    {...props}
  >
    <Cover h={['130px', '160px']} w="100%" book={book}>
      <Img src={book.coverPhoto && book.coverPhoto.small} alt={book.title} />
    </Cover>
    <Div h={['50px', '53px']} fontSize={[11, 14]}>
      <BookTitle>{book.title}</BookTitle>
      <ReadingLevel>
        <Trans id="level">Level {book.readingLevel}</Trans>
      </ReadingLevel>
    </Div>
  </CardBase>
);
