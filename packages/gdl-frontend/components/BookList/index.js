// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Fragment, type Element } from 'react';
import styled from 'react-emotion';
import { Trans } from '@lingui/react';
import { Typography, Button } from '@material-ui/core';

import View from '../../elements/View';
import { spacing } from '../../style/theme/';
import type { Book } from '../../types';
import BookLink from '../BookLink';
import BrowseLink, { type Props as BrowseLinkProps } from '../BrowseLink';

type Props = {
  books: Array<Book>,
  heading: Element<typeof Trans>,
  browseLinkProps?: BrowseLinkProps
};

// Add a wrapper around each book list, so we can apply padding on the last element to get our wanted "overscroll effect" on mobile
const BookList = ({ books, heading, browseLinkProps }: Props) => (
  <Fragment>
    <View
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      mb={spacing.small}
    >
      <Typography component="h1" variant="headline">
        {heading}
      </Typography>
      {browseLinkProps && (
        <BrowseLink {...browseLinkProps}>
          <Button color="primary">
            <Trans>More</Trans>
          </Button>
        </BrowseLink>
      )}
    </View>
    <NegativeMarginDiv>
      <ScrollDiv>
        {books.map(book => (
          <CoverDiv key={book.id}>
            <BookLink key={book.id} book={book} />
          </CoverDiv>
        ))}
      </ScrollDiv>
    </NegativeMarginDiv>
  </Fragment>
);

const NegativeMarginDiv = styled('div')`
  margin: 0 -${spacing.medium};
`;

const ScrollDiv = styled('div')`
  overflow-x: auto;
  /* Fixes problem with scrolling in Safari all over the place */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
  white-space: nowrap;
  padding: 0 ${spacing.medium};
`;

const CoverDiv = styled('div')`
  display: inline-block;
  &:not(:last-child) {
    margin-right: 11px;
  }
`;

BookList.defaultProps = {
  route: (book: Book) => `/${book.language.code}/books/${book.id}`
};

export default BookList;
