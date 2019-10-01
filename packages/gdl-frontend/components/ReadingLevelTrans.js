// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import type { ReadingLevel } from '../gqlTypes';

type Props = {|
  readingLevel: ReadingLevel | 'Games'
|};

export default function ReadingLevelTrans({ readingLevel: level }: Props) {
  switch (level) {
    case 'Decodable':
      return <FormattedMessage id="Decodable" defaultMessage="Decodable" />;
    case 'Decodable1':
      return <FormattedMessage id="Decodable1" defaultMessage="Decodable 1" />;
    case 'Decodable2':
      return <FormattedMessage id="Decodable2" defaultMessage="Decodable 2" />;
    case 'Decodable3':
      return <FormattedMessage id="Decodable3" defaultMessage="Decodable 3" />;
    case 'Decodable4':
      return <FormattedMessage id="Decodable4" defaultMessage="Decodable 4" />;
    case 'Decodable5':
      return <FormattedMessage id="Decodable5" defaultMessage="Decodable 5" />;
    case 'Decodable6':
      return <FormattedMessage id="Decodable6" defaultMessage="Decodable 6" />;
    case 'Decodable7':
      return <FormattedMessage id="Decodable7" defaultMessage="Decodable 7" />;
    case 'Decodable8':
      return <FormattedMessage id="Decodable8" defaultMessage="Decodable 8" />;
    case 'Decodable9':
      return <FormattedMessage id="Decodable9" defaultMessage="Decodable 9" />;
    case 'Decodable10':
      return (
        <FormattedMessage id="Decodable10" defaultMessage="Decodable 10" />
      );
    case 'Decodable11':
      return (
        <FormattedMessage id="Decodable11" defaultMessage="Decodable 11" />
      );
    case 'Decodable12':
      return (
        <FormattedMessage id="Decodable12" defaultMessage="Decodable 12" />
      );
    case 'ReadAloud':
      return <FormattedMessage id="Read aloud" defaultMessage="Read aloud" />;
    case 'Level1':
      return <FormattedMessage id="Level 1" defaultMessage="Level 1" />;
    case 'Level2':
      return <FormattedMessage id="Level 2" defaultMessage="Level 2" />;
    case 'Level3':
      return <FormattedMessage id="Level 3" defaultMessage="Level 3" />;
    case 'Level4':
      return <FormattedMessage id="Level 4" defaultMessage="Level 4" />;
    case 'Games':
      return <FormattedMessage id="Games" defaultMessage="Games" />;
    default:
      return level;
  }
}
