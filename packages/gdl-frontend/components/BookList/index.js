// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { type Element } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { FormattedMessage } from 'react-intl';
import { Typography, Button } from '@material-ui/core';

import { View, Shimmer } from '../../elements';
import { spacing, misc } from '../../style/theme/';
import media from '../../style/media';
import BookLink from '../ScrollView/BookLink';
import { coverWidths } from '../ScrollView/coverWidths';
import BrowseLink, { type Props as BrowseLinkProps } from '../BrowseLink';
import LevelHR from '../Level/LevelHR';
import type {
  ReadingLevel,
  BooksAndFeatured_Level1_results as Book
} from '../../gqlTypes';

type Props = {
  books: $ReadOnlyArray<Book>,
  heading: Element<typeof FormattedMessage>,
  browseLinkProps?: BrowseLinkProps,
  loading?: boolean,
  level?: ReadingLevel,
  shouldBeColorized?: boolean
};

// Add a wrapper around each book list, so we can apply padding on the last element to get our wanted "overscroll effect" on mobile
const BookList = ({
  books,
  heading,
  browseLinkProps,
  loading,
  level,
  shouldBeColorized
}: Props) => (
  <div
    css={{
      visibility: `${!loading && books.length === 0 ? 'hidden' : 'visible'}`
    }}
  >
    <View
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{
        visibility: !loading && books.length === 0 ? 'hidden' : 'visible'
      }}
    >
      <Typography component="h1" variant="h5" style={{ textAlign: 'left' }}>
        {heading}
      </Typography>
      {browseLinkProps && (
        <BrowseLink {...browseLinkProps}>
          {/* Negative margin to align the link against the edge of the container */}
          <Button
            data-cy="book-list-more-button"
            color="primary"
            size="small"
            variant="outlined"
          >
            <FormattedMessage id="More" defaultMessage="More" />
          </Button>
        </BrowseLink>
      )}
    </View>
    {/* Adjust the space between books and the hr */}
    {shouldBeColorized && (
      <LevelHR level={level} css={{ marginBottom: spacing.medium }} />
    )}
    <Scroller>
      {loading
        ? [...Array(5).keys()].map(index => (
            <div css={[itemStyle, shimmerStyle]} key={index}>
              <Shimmer className={shimmerStyle} />
            </div>
          ))
        : books.map(book => (
            <div className={itemStyle} key={book.id}>
              <BookLink book={book} />
            </div>
          ))}
    </Scroller>
  </div>
);

const shimmerStyle = css`
  &:last-child {
    margin-right: ${coverWidths.large - coverWidths.small}px;
  }
  width: ${coverWidths.small}px;
  ${media.tablet`
  width: ${coverWidths.large}px;
`};
`;

const COLUMN_GAP = 15;
/**
 * For browsers that doesn't support grid we add some spacing around the book covers
 */
const itemStyle = css`
  display: inline-block;
  &:not(:last-child) {
    margin-right: ${COLUMN_GAP}px;
  }
  @supports (display: grid) {
    margin-right: 0 !important;
  }
`;

/**
 * We use CSS grid for browsers that support it.
 * So we get the nice fluid/dynamic spacing between the items (down the minimum value set the as the column gap)
 *
 * Currently this is coded to show at the most 5 book covers (so the spacing is the same between the items even if there are fewer than 5 books)
 */

const Scroller = styled('div')`
  overflow-x: auto;
  /* Fixes problem with scrolling in Safari all over the place */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }

  /* Ensure the box-shadow isn't cut off and allows us to "scroll" on the edges/across the gutters  */
  margin: 0 -${misc.gutter}px -${misc.gutter}px;
  padding: 0 ${misc.gutter}px ${misc.gutter}px;

  @supports (display: grid) {
    display: grid;
    justify-content: space-between;
    grid-gap: ${COLUMN_GAP}px;
    grid-auto-flow: column;

    grid-template-columns: repeat(5, ${coverWidths.small}px);

    /* This carefully calcluated value allows us to "scroll" across gutter on devices that require it */
    @media (max-width: ${COLUMN_GAP * 4 +
        coverWidths.small * 5 +
        misc.gutter * 2}px) {
      grid-template-columns: repeat(4, ${coverWidths.small}px) ${coverWidths.small +
          misc.gutter}px;
    }

    ${media.tablet`
      grid-template-columns: repeat(5, ${coverWidths.large}px);
    `};
  }
`;

BookList.defaultProps = {
  route: (book: Book) => `/${book.language.code}/books/${book.id}`
};

export default BookList;
