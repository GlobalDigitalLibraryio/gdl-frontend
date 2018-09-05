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
import type { Book } from '../types';
import CoverImage from './CoverImage';
import media from '../style/media';

/**
 * Add small brightness effect to book cover when hovered
 */
const cardCss = css`
  position: relative;
  &:hover {
    img {
      transition: 1s opacity linear;
      pointer-events: none;
      filter: opacity(0.9);
    }
  }
  width: 105px;
  ${media.tablet`
   width: 130px;
  `};
`;

const ClickTarget = styled('a')`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

/**
 * Adds an absolute anchor above the whole cover, so you can click anywhere.
 * It is hidden from screen readers and when using the keyboard, in that case the title is also a link.
 */
export default ({ book }: { book: Book }) => (
  <Card className={cardCss}>
    <Link
      route="book"
      params={{ id: book.id, lang: book.language.code }}
      passHref
    >
      <ClickTarget aria-hidden tabIndex="-1" />
    </Link>
    <CoverImage size="small" src={book.coverImage && book.coverImage.url} />
    <CardContent css={{ padding: 10, ':last-child': { paddingBottom: 10 } }}>
      <Link
        route="book"
        params={{ id: book.id, lang: book.language.code }}
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
