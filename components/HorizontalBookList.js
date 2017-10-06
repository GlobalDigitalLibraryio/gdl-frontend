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

const FlexScroller = Flex.extend`overflow-x: auto;`;

export default ({ books, ...props }: { books: Array<Book> }) => (
  <FlexScroller mx={-8} {...props}>
    {books.map(book => (
      <Link
        route="book"
        params={{ id: book.id, lang: book.language.code }}
        key={book.id}
        passHref
      >
        <BookCardCover book={book} mx={8} is="a" />
      </Link>
    ))}
  </FlexScroller>
);
