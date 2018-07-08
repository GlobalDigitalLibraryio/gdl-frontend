// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import type {Book} from "../../../types";
import BookCover from "../../BookCover";

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
  return (
    <Wrapper>
          <BookCover
            w={[80, 115]}
            h={[108, 155]}
            coverImage={book.coverImage}
          />

      <Div>
        <BookLevel>
        </BookLevel>
          {renderTitle(book)}
        {renderBookDescription(book)}
      </Div>
    </Wrapper>
  );
};

export default SearchHit;
