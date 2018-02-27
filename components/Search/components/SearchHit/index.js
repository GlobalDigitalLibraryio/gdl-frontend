// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';

import { type Book } from '../../../../types';
import { Link } from '../../../../routes';
import CoverImage from '../../../CoverImage';
import A from '../../../A';
import {
  BookTitle,
  BookDescription,
  BookLevel,
  Wrapper,
  CoverWrap,
  Div
} from './styled';

function renderTitle(book) {
  if (book.highlightTitle) {
    return (
      <BookTitle
        lang={book.language.code}
        dangerouslySetInnerHTML={{ __html: book.highlightTitle }}
      />
    );
  }
  return <BookTitle lang={book.language.code}>{book.title}</BookTitle>;
}

function renderBookDescription(book) {
  if (book.highlightDescription) {
    return (
      <BookDescription
        lang={book.language.code}
        dangerouslySetInnerHTML={{ __html: book.highlightDescription }}
      />
    );
  }
  return (
    <BookDescription lang={book.language.code}>
      {book.description}
    </BookDescription>
  );
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
      <CoverWrap aria-hidden>
        <Link route={bookRoute} passHref>
          <a title={book.title}>
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
        <BookLevel>
          <Trans>Level {book.readingLevel}</Trans>
        </BookLevel>
        {renderBookDescription(book)}
      </Div>
    </Wrapper>
  );
};

export default SearchHit;
