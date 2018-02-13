// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import GridContainer from './styledGridContainer';
import type { Book } from '../../types';
import BookCardCover from './../BookCardCover';
import { Link } from '../../routes';

type Props = {
  books: Array<Book>,
  route(book: Book): string
};

const BookGrid = ({ books, route }: Props) => (
  <GridContainer>
    {books.map(book => (
      <Link route={route(book)} key={book.id}>
        <a>
          <BookCardCover book={book} />
        </a>
      </Link>
    ))}
  </GridContainer>
);

export default BookGrid;
