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
import A from '../../A';

const BookTitle = styled('h3')`
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
  em {
    font-weight: 800;
    font-style: normal;
  }
`;

const BookDescription = styled('p')`
  font-size: 0.9rem;
  line-height: 1.3rem;
  margin: 0;
  em {
    font-weight: bold;
  }
`;

const Level = styled('span')`
  display: block;
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 500;
`;

const Wrapper = styled('div')`
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

function renderTitle(book) {
  if (book.highlightTitle) {
    return (
      <BookTitle dangerouslySetInnerHTML={{ __html: book.highlightTitle }} />
    );
  }
  return <BookTitle>{book.title}</BookTitle>;
}

function renderBookDescription(book) {
  if (book.highlightDescription) {
    return (
      <BookDescription
        dangerouslySetInnerHTML={{ __html: book.highlightDescription }}
      />
    );
  }
  return <BookDescription>{book.description}</BookDescription>;
}

const SearchHit = ({
  book,
  route
}: {
  book: Book,
  route(book: Book): string
}) => {
  const bookRoute = route(book);
  return (
    <Wrapper>
      <CoverWrap>
        <Link route={bookRoute} passHref>
          <a>
            <CoverImage
              width={[80, 130]}
              src={book.coverPhoto && book.coverPhoto.large}
            />
          </a>
        </Link>
      </CoverWrap>
      <Div>
        <Link route={bookRoute} passHref>
          <A>{renderTitle(book)}</A>
        </Link>
        <Level>Level {book.readingLevel}</Level>
        {renderBookDescription(book)}
      </Div>
    </Wrapper>
  );
};

export default SearchHit;
