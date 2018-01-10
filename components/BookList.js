// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import Flex from './Flex';
import type { Book } from '../types';
import BookCardCover from './BookCardCover';
import { Link } from '../routes';

const FlexScroller = styled(Flex)`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  a {
    margin-bottom: 2px;
    margin-left: 6px;
    margin-right: 6px;
  }
  a:first-child {
    margin-left: 0px;
  }
  a:last-child {
    padding-right: 15px;
  }
`;

type Props = {
  books: Array<Book>,
  route: (book: Book) => string
};

const BookList = ({ books, route, ...props }: Props) => (
  <FlexScroller mx={[-15, -20]} px={[15, 20]} {...props}>
    {books.map(book => (
      <Link route={route(book)} key={book.id}>
        <a>
          <BookCardCover book={book} />
        </a>
      </Link>
    ))}
  </FlexScroller>
);

BookList.defaultProps = {
  route: (book: Book) => `/${book.language.code}/books/${book.id}`
};

export default BookList;
