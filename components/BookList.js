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
`;

type Props = {
  books: Array<Book>,
  route: 'book' | 'bookByLevel' | 'bookByNew',
};

const BookList = ({ books, route, ...props }: Props) => (
  <FlexScroller mx={-6} {...props}>
    {books.map(book => (
      <Link
        route={route}
        params={{ id: book.id, lang: book.language.code }}
        key={book.id}
      >
        <a>
          <BookCardCover book={book} mx={6} />
        </a>
      </Link>
    ))}
  </FlexScroller>
);

BookList.defaultProps = {
  route: 'book',
};

export default BookList;
