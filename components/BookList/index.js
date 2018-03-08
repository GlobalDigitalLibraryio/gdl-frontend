// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css } from 'react-emotion';
import { Trans } from '@lingui/react';

import Flex from '../Flex';
import type { Book } from '../../types';
import BookCardCover from '../BookCardCover';
import H3 from '../H3';

/**
 * Wrap an extra div around the book covers to get the nice horizontal scrolling on small screens
 */
const scroll = css`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  > div {
    margin-bottom: 2px;
    margin-left: 6px;
    margin-right: 6px;
  }
  > div:first-child {
    margin-left: 0px;
  }
  > div:last-child {
    padding-right: 15px;
  }
`;

const Heading = H3.withComponent('h1');

type Props = {
  books: Array<Book>,
  route: (book: Book) => string,
  heading: React.Element<typeof Trans>
};

const BookList = ({ books, route, heading, ...props }: Props) => (
  <React.Fragment>
    <Heading>{heading}</Heading>
    <Flex mx={[-15, -20]} px={[15, 20]} className={scroll} {...props}>
      {books.map(book => (
        <div key={book.id}>
          <BookCardCover book={book} route={route} />
        </div>
      ))}
    </Flex>
  </React.Fragment>
);

BookList.defaultProps = {
  route: (book: Book) => `/${book.language.code}/books/${book.id}`
};

export default BookList;
