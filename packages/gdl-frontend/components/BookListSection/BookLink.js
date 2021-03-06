// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { CardContent, Typography } from '@material-ui/core';

import { Link } from '../../routes';
import CoverImage from '../CoverImage';
import CustomCard from './CustomCard';
import ClickTarget from './ClickTarget';

export type Book = $ReadOnly<{
  id: string,
  bookId: number,
  title: string,
  language: {
    code: string
  },
  coverImage: ?{ url: string }
}>;

/**
 * Adds an absolute anchor above the whole cover, so you can click anywhere.
 * It is hidden from screen readers and when using the keyboard, in that case the title is also a link.
 */
export default ({ book }: { book: Book }) => (
  <CustomCard>
    <Link
      route="book"
      params={{ id: book.bookId, lang: book.language.code }}
      passHref
    >
      <ClickTarget aria-hidden tabIndex="-1" data-cy="book-link" />
    </Link>
    <CoverImage size="small" coverImage={book.coverImage} noShadow />
    <CardContent css={{ padding: 10, ':last-child': { paddingBottom: 10 } }}>
      <Link
        route="book"
        params={{ id: book.bookId, lang: book.language.code }}
        passHref
      >
        <Typography
          lang={book.language.code}
          title={book.title}
          noWrap
          component="a"
          align="center"
        >
          {book.title}
        </Typography>
      </Link>
    </CardContent>
  </CustomCard>
);
