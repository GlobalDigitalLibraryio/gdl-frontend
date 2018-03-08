// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';

import { Link } from '../routes';
import type { Book } from '../types';
import Card from './Card';
import ReadingLevel from './ReadingLevel';
import Box from './Box';
import theme from '../style/theme';
import CoverImage from './CoverImage';

const Div = styled(Box)`
  text-align: center;
  color: ${theme.colors.dark};
  border-top: 1px solid ${theme.colors.grayLight};
  background-color: ${theme.colors.white};
`;

const BookTitle = styled('a')`
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 7px;
  overflow: hidden;
  color: inherit;
`;

/**
 * Add small brightness effect to book cover when hovered
 */
const hoverImgEffect = css`
  &:hover {
    img {
      transition: 1s opacity linear;
      pointer-events: none;
      filter: opacity(0.9);
    }
  }
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
export default ({ book, route }: { book: Book, route(book: Book): string }) => (
  <Box w={[105, 130]}>
    <Card className={hoverImgEffect}>
      <Link route={route(book)} passHref>
        <ClickTarget aria-hidden tabIndex="-1" />
      </Link>
      <CoverImage
        ariaHidden
        w={[105, 130]}
        h={[130, 160]}
        src={book.coverPhoto && book.coverPhoto.large}
      />
      <Div h={[45, 50]} fontSize={[11, 14]} pt="4px" px="2px">
        <Link route={route(book)} passHref>
          <BookTitle lang={book.language.code} title={book.title}>
            {book.title}
          </BookTitle>
        </Link>
        <ReadingLevel level={book.readingLevel} />
      </Div>
    </Card>
  </Box>
);
