// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Typography } from '@material-ui/core';

import { type CoverImage as CoverImageType } from 'gdl-image';
import type { Book } from '../../../../types';
import ReadingLevelTrans from '../../../ReadingLevelTrans';
import { spacing } from '../../../../style/theme';
import { Link } from '../../../../routes';
import CoverImage from '../../../CoverImage';
import A from '../../../../elements/A';
import { BookTitle, BookDescription, Wrapper, Divider } from './styled';

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

  // TODO: This is only temporarliy until we get searches via GQL
  let coverImage;
  if (book.coverImage) {
    coverImage = {
      ...book.coverImage,
      variants: book.coverImage.variants
        ? Object.values(book.coverImage.variants)
        : null
    };
  }

  return (
    <Wrapper>
      <Link route={bookRoute} passHref>
        <a title={book.title} tabIndex="-1" aria-hidden>
          {/* $FlowFixMe: Remove this when we get search results via gql */}
          <CoverImage coverImage={coverImage} size="small" />
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
          <ReadingLevelTrans readingLevel={book.readingLevel} />
        </Typography>
      </div>
    </Wrapper>
  );
};

export default SearchHit;
