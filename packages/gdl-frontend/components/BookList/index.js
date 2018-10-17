// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { type Element } from 'react';
import styled from 'react-emotion';
import { Trans } from '@lingui/react';
import { Typography, Button } from '@material-ui/core';

import View from '../../elements/View';
import { spacing, misc } from '../../style/theme/';
import media from '../../style/media';
import type { Book } from '../../types';
import BookLink, { coverWidths } from '../BookLink';
import BrowseLink, { type Props as BrowseLinkProps } from '../BrowseLink';

type Props = {
  books: Array<Book>,
  heading: Element<typeof Trans>,
  browseLinkProps?: BrowseLinkProps
};

// Add a wrapper around each book list, so we can apply padding on the last element to get our wanted "overscroll effect" on mobile
const BookList = ({ books, heading, browseLinkProps }: Props) => (
  <>
    <View
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      mb={spacing.small}
    >
      <Typography component="h1" variant="h5">
        {heading}
      </Typography>
      {browseLinkProps && (
        <BrowseLink {...browseLinkProps}>
          {/* Negative margin to align the link against the edge of the container */}
          <Button color="primary" size="small" variant="outlined">
            <Trans>More</Trans>
          </Button>
        </BrowseLink>
      )}
    </View>
    <Scroller>
      {books.map(book => (
        <CoverItem key={book.id}>
          <BookLink book={book} />
        </CoverItem>
      ))}
    </Scroller>
  </>
);

/**
 * For browsers that doesn't support grid we add some spacing around the book covers
 */
const CoverItem = styled('div')`
  display: inline-block;
  &:not(:last-child) {
    margin-right: 15px;
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

const COLUMN_GAP = 15;
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
    column-gap: ${COLUMN_GAP}px;
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
