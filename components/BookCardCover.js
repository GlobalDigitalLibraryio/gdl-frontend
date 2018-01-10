// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import type { Book } from '../types';
import Card from './Card';
import ReadingLevel from './ReadingLevel';
import Box from './Box';
import theme from '../style/theme';
import CoverImage from './CoverImage';

const Div = styled(Box)`
  text-align: center;
  color: ${theme.colors.dark};
  border-top: 1px solid ${theme.colors.grayLight};
  background-color: ${theme.colors.white};
`;

const BookTitle = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 7px;
  overflow: hidden;
`;

// TODO: Figure out why box-shadow is clipped
export default ({ book, ...props }: { book: Book }) => (
  <Box w={[105, 130]} flex="0 0 auto" {...props}>
    <Card>
      <CoverImage
        h={[130, 160]}
        src={book.coverPhoto && book.coverPhoto.large}
      />
      <Div h={[45, 50]} fontSize={[11, 14]} pt="4px" px="2px">
        <BookTitle>{book.title}</BookTitle>
        <ReadingLevel level={book.readingLevel} />
      </Div>
    </Card>
  </Box>
);
