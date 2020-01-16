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
    case 'Level5':
      return <FormattedMessage id="Level 5" defaultMessage="Level 5" />;
    case 'Level6':
      return <FormattedMessage id="Level 6" defaultMessage="Level 6" />;
    case 'Games':
      return (
        <FormattedMessage id="Games (beta)" defaultMessage="Games (beta)" />
      );
    default:
      return level;
  }
}
