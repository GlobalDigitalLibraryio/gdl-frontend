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
  books: Array<Book>
};

const BookGrid = ({ books }: Props) => (
  <GridContainer>
    {books.map(book => <BookLink key={book.id} book={book} />)}
  </GridContainer>
);

export default BookGrid;
