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

export default ({ books, ...props }: { books: Array<Book> }) => (
  <Flex justify="space-between" {...props}>
    {books.map(book => (
      <Link
        route="book"
        params={{ id: book.id, lang: book.language.code }}
        key={book.id}
        passHref
      >
        <BookCardCover book={book} is="a" />
      </Link>
    ))}
  </Flex>
);
