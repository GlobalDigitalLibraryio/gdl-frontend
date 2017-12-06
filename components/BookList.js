// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Flex from './Flex';
import type { Book } from '../types';
import BookCardCover from './BookCardCover';
import { Link } from '../routes';

const FlexScroller = Flex.extend`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

type Props = {
  books: Array<Book>,
  route: (book: Book) => string,
};

// The inline style here on the anchor ensures the box shadow doesn't get clipped.
// TODO: Fix this properly
const BookList = ({ books, route, ...props }: Props) => (
  <FlexScroller mx={-6} {...props}>
    {books.map(book => (
      <Link route={route(book)} key={book.id}>
        <a style={{ marginBottom: '2px' }}>
          <BookCardCover book={book} mx={6} />
        </a>
      </Link>
    ))}
  </FlexScroller>
);

BookList.defaultProps = {
  route: (book: Book) => `/${book.language.code}/books/${book.id}`,
};

export default BookList;
