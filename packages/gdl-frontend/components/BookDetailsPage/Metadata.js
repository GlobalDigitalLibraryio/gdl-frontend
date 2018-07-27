// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans } from '@lingui/react';
import styled from 'react-emotion';

import { ContributorTypes, type BookDetails } from '../../types';
import A from '../../elements/A';
import Ribbon from './LevelRibbon';
import { colors, fonts, spacing } from '../../style/theme';
import media from '../../style/media';

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
  // NB! This should really use <Plural />, but after an update it suddenly implicitly depends on the Intl API. Which causes it to thow exceptions in some browsers
  // Since we currently have no other langauge than English, we skip the polyfill for now because it is quite huge.
  // See issue here: https://github.com/GlobalDigitalLibraryio/issues/issues/437
  switch (type) {
    case ContributorTypes.AUTHOR:
      return value > 1 ? <Trans>Authors</Trans> : <Trans>Author</Trans>; // <Plural one="Author" other="Authors" value={value} />;
    case ContributorTypes.ILLUSTRATOR:
      return value > 1 ? (
        <Trans>Illustrators</Trans>
      ) : (
        <Trans>Illustrator</Trans>
      ); //<Plural one="Illustrator" other="Illustrators" value={value} />;
    case ContributorTypes.TRANSLATOR:
      return value > 1 ? <Trans>Translators</Trans> : <Trans>Translator</Trans>; //<Plural one="Translator" other="Translators" value={value} />;
    case ContributorTypes.PHOTOGRAPHER:
      return value > 1 ? (
        <Trans>Photographers</Trans>
      ) : (
        <Trans>Photographer</Trans>
      ); //<Plural one="Photographer" other="Photographers" value={value} />;
    default:
      return value > 1 ? (
        <Trans>Contributors</Trans>
      ) : (
        <Trans>Contributor</Trans>
      ); //<Plural one="Contributor" other="Contributors" value={value} />;
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
    <Div>
      <Ribbon level={book.readingLevel} />

      {Object.values(ContributorTypes).map(type =>
        listContributors(type, book.contributors)
      )}

      <Heading>
        <Trans>License</Trans>
      </Heading>
      <A href={book.license.url}>{book.license.description}</A>
    </Div>
  );
};

const Div = styled('div')`
  color: ${colors.text.subtle};
  ${media.tablet`
    padding-left: ${spacing.medium};
  `};
`;

export default BookMeta;
