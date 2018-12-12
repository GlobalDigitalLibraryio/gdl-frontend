// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Card, CardContent, Typography } from '@material-ui/core';

import { Link } from '../routes';
import CoverImage from './CoverImage';
import media from '../style/media';

export const coverWidths = {
  small: 105,
  large: 130
};

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
  <Card className={cardCss}>
    <Link
      route="book"
      params={{ id: book.bookId, lang: book.language.code }}
      passHref
    >
      <ClickTarget aria-hidden tabIndex="-1" />
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
  </Card>
);

/**
 * Add small brightness effect to book cover when hovered
 */
const cardCss = css`
  position: relative;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    img {
      transition: 1s opacity linear;
      pointer-events: none;
      filter: opacity(0.9);
    }
  }
  width: ${coverWidths.small}px;
  ${media.tablet`
    width: ${coverWidths.large}px;
  `};
`;

const ClickTarget = styled('a')`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;
