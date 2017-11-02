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
  <Flex wrap mx={-6} {...props}>
    {books.map(book => (
      <Link
        route="book"
        params={{ id: book.id, lang: book.language.code }}
        key={book.id}
      >
        <a>
          <BookCardCover book={book} mx={6} mb={20} />
        </a>
      </Link>
    ))}
  </Flex>
);
