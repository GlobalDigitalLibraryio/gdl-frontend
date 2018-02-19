// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';

import { type Book } from '../../../types';
import { Link } from '../../../routes';
import theme from '../../../style/theme';
import CoverImage from '../../CoverImage';

const BookTitle = styled('h3')`
  font-size: 1.1rem;
  margin: 0;
  font-weight: normal;
`;
const BookDescription = styled('p')`
  font-size: 0.9rem;
  line-height: 1.3rem;
  margin: 0;
`;

const Level = styled('span')`
  display: block;
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 500;
`;

const Wrapper = styled('a')`
  border-bottom: 1px solid ${theme.colors.grayLight};
  display: flex;
  padding-bottom: 15px;
  color: ${theme.colors.dark};
  :not(:first-child) {
    padding-top: 15px;
  }
`;

const CoverWrap = styled('div')`
  flex: 0 0 80px;
  min-height: 102px;
`;

const Div = styled('div')`
  margin-left: 15px;
`;

const SearchHit = ({
  book,
  route
}: {
  book: Book,
  route(book: Book): string
}) => (
  <Link route={route(book)}>
    <Wrapper>
      <CoverWrap>
        <CoverImage
          width={[80, 130]}
          src={book.coverPhoto && book.coverPhoto.large}
        />
      </CoverWrap>
      <Div>
        <BookTitle>{book.title}</BookTitle>
        <Level>Level {book.readingLevel}</Level>
        <BookDescription>{book.description}</BookDescription>
      </Div>
    </Wrapper>
  </Link>
);

export default SearchHit;
