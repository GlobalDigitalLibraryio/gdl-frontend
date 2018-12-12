// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Typography } from '@material-ui/core';

import type { ReadingLevel } from '../../../../gqlTypes';

import ReadingLevelTrans from '../../../ReadingLevelTrans';
import { spacing } from '../../../../style/theme';
import { Link } from '../../../../routes';
import CoverImage from '../../../CoverImage';
import A from '../../../../elements/A';
import { BookTitle, BookDescription, Wrapper, Divider } from './styled';
import CircleLabel from '../../../GlobalMenu/CircleLabel';

type Book = $ReadOnly<{
  id: string,
  bookId: number,
  title: string,
  highlightTitle: ?string,
  description: string,
  highlightDescription: ?string,
  readingLevel: ReadingLevel,
  language: {
    name: string,
    code: string
  },
  coverImage: ?{ url: string }
}>;

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
  const bookRoute = `/${book.language.code}/books/details/${book.bookId}`;

  return (
    <Wrapper>
      <Link route={bookRoute} passHref>
        <a title={book.title} tabIndex="-1" aria-hidden>
          <CoverImage coverImage={book.coverImage} size="small" />
        </a>
      </Link>

      {/* Hide overflow so book language / level elements gets truncated */}
      <div css={{ overflow: 'hidden', marginLeft: spacing.small }}>
        <Link route={bookRoute} passHref>
          <A>{renderTitle(book)}</A>
        </Link>
        {renderBookDescription(book)}
        <Typography
          variant="caption"
          component="div"
          noWrap
          color="textSecondary"
        >
          {book.language.name}
          <Divider ariaHidden />
          <CircleLabel
            level={book.readingLevel}
            style={{
              marginBottom: '-2px',
              marginRight: '4px',
              fontSize: 'small'
            }}
          />
          <ReadingLevelTrans readingLevel={book.readingLevel} />
        </Typography>
      </div>
    </Wrapper>
  );
};

export default SearchHit;
