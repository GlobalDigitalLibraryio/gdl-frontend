// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import GridContainer from './styledGridContainer';
import BookLink, { type Book } from './../ScrollView/BookLink';

type Props = {
  books: $ReadOnlyArray<Book>
};

const BookGrid = ({ books }: Props) => (
  <GridContainer>
    {books.map(book => (
      <BookLink key={book.id} book={book} />
    ))}
  </GridContainer>
);

export default BookGrid;
