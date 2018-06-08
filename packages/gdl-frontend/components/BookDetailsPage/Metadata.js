// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans, Plural } from '@lingui/react';
import styled from 'react-emotion';

import { ContributorTypes, type BookDetails } from '../../types';
import A from '../../elements/A';
import Box from '../Box';
import Ribbon from './LevelRibbon';
import { colors, fonts, spacing } from '../../style/theme';

type Props = {
  book: BookDetails
};

// NB! The margin top selector here is kinda brittle. The readingLevel ribbon must be the only element before the first heading
const Heading = styled('div')`
  &:not(:nth-child(2)) {
    margin-top: ${spacing.medium};
  }

  font-weight: ${fonts.weight.medium};
  color: ${colors.text.default};

  margin-bottom: ${spacing.xsmall};
`;

function headingText(type, value) {
  switch (type) {
    case ContributorTypes.AUTHOR:
      return <Plural one="Author" other="Authors" value={value} />;
    case ContributorTypes.ILLUSTRATOR:
      return <Plural one="Illustrator" other="Illustrators" value={value} />;
    case ContributorTypes.TRANSLATOR:
      return <Plural one="Translator" other="Translators" value={value} />;
    case ContributorTypes.PHOTOGRAPHER:
      return <Plural one="Photographer" other="Photographers" value={value} />;
    default:
      return <Plural one="Contributor" other="Contributors" value={value} />;
  }
}

function listContributors(contributorType, contributors) {
  const contributorsOfType = contributors.filter(
    c => c.type === contributorType
  );

  if (contributorsOfType.length > 0) {
    return (
      // $FlowFixMe this is a string...
      <Fragment key={contributorType}>
        <Heading>
          {headingText(contributorType, contributorsOfType.length)}
        </Heading>
        {contributorsOfType.map(contributor => contributor.name).join(', ')}
      </Fragment>
    );
  }
  return null;
}

const BookMeta = ({ book }: Props) => {
  return (
    <Box color={colors.text.subtle} pl={[0, spacing.medium]}>
      <Ribbon level={book.readingLevel} />

      {Object.values(ContributorTypes).map(type =>
        listContributors(type, book.contributors)
      )}

      <Heading>
        <Trans>License</Trans>
      </Heading>
      <A href={book.license.url}>{book.license.description}</A>
    </Box>
  );
};

export default BookMeta;
