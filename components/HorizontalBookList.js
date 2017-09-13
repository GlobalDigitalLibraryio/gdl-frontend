// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import type { Book } from '../types';
import BookCover from './BookCover';
import { Link } from '../routes';

const BookTitle = styled.span`
  text-align: center;
  color: #444;
  display: block;
`;

export default ({ books }: { books: Array<Book> }) => (
  <Flex justify="space-between">
    {books.map(book => (
      <Link route="book" params={{ id: book.id }} key={book.id} passHref>
        <Box is="a">
          <BookCover book={book} />
          <BookTitle>{book.title}</BookTitle>
        </Box>
      </Link>
    ))}
  </Flex>
);
