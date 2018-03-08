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
import BookLink from './../BookLink';

type Props = {
  books: Array<Book>,
  route(book: Book): string
};

const BookGrid = ({ books, route }: Props) => (
  <GridContainer>
    {books.map(book => <BookLink key={book.id} book={book} route={route} />)}
  </GridContainer>
);

export default BookGrid;
