// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import type { Book } from '../../../../types';
import ReadingLevelTrans from '../../../ReadingLevelTrans';
import { Link } from '../../../../routes';
import BookCover from '../../../BookCover';
import A from '../../../../elements/A';
import { BookTitle, BookDescription, BookLevel, Wrapper, Div } from './styled';

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

const SearchHit = ({ book }: { book: Book }) => {
  const bookRoute = `/${book.language.code}/books/details/${book.id}`;
  return (
    <Wrapper>
      <Link route={bookRoute} passHref>
        <a title={book.title} tabIndex="-1" aria-hidden>
          <BookCover
            w={[80, 115]}
            h={[108, 155]}
            coverImage={book.coverImage}
          />
        </a>
      </Link>
      <Div>
        <Link route={bookRoute} passHref>
          <A>{renderTitle(book)}</A>
        </Link>
        <BookLevel>
          <ReadingLevelTrans readingLevel={book.readingLevel} />
        </BookLevel>
        {renderBookDescription(book)}
      </Div>
    </Wrapper>
  );
};

export default SearchHit;
