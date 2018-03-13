// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { DateFormat, Trans } from '@lingui/react';

import type { BookDetails } from '../../types';
import A from '../A';
import Box from '../Box';
import Ribbon from './Ribbon';
import { Heading } from './styled';

type Props = {
  book: BookDetails
};

const BookMeta = ({ book }: Props) => {
  const contributors = book.contributors
    .map(contributor => <span key={contributor.id}>{contributor.name}</span>)
    .map((item, index) => [index > 0 && ', ', item]);

  return (
    <Box p={[15, 20]} fontSize={[14, 16]}>
      <Ribbon level={book.readingLevel} />
      {book.datePublished && (
        <Box mb={15}>
          <Heading>
            <Trans>Published</Trans>
          </Heading>
          <DateFormat value={new Date(book.datePublished)} />
        </Box>
      )}
      <Box mb={15}>
        <Heading>
          <Trans>Authors</Trans>
        </Heading>
        {contributors}
      </Box>
      <Box>
        <Heading>
          <Trans>License</Trans>
        </Heading>
        <A href={book.license.url}>{book.license.description}</A>
      </Box>
    </Box>
  );
};

export default BookMeta;
