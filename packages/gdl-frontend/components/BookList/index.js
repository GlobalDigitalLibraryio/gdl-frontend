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

import View from '../../elements/View';
import Text from '../../elements/Text';
import A from '../../elements/A';
import { spacing, fonts } from '../../style/theme/';
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
      <Text
        accessibilityRole="heading"
        fontSize="1.3rem"
        fontWeight={fonts.weight.medium}
      >
        {heading}
      </Text>
      {browseLinkProps && (
        <BrowseLink {...browseLinkProps}>
          <A fontWeight={fonts.weight.medium}>
            <Trans>More</Trans>
          </A>
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
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
  white-space: nowrap;
  padding: 0 ${spacing.medium};
  padding-bottom: 4px;
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
