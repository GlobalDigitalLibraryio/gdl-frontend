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
  if (level === 'Decodable') {
    return <FormattedMessage id="Decodable" defaultMessage="Decodable" />;
  } else if (level === 'ReadAloud') {
    return <FormattedMessage id="Read aloud" defaultMessage="Read aloud" />;
  } else if (level === 'Level1') {
    return <FormattedMessage id="Level 1" defaultMessage="Level 1" />;
  } else if (level === 'Level2') {
    return <FormattedMessage id="Level 2" defaultMessage="Level 2" />;
  } else if (level === 'Level3') {
    return <FormattedMessage id="Level 3" defaultMessage="Level 3" />;
  } else if (level === 'Level4') {
    return <FormattedMessage id="Level 4" defaultMessage="Level 4" />;
  } else if (level === 'Games') {
    return (
      <FormattedMessage id="Games (Android)" defaultMessage="Games (Android)" />
    );
  }
  return (
    <FormattedMessage
      id="Level"
      defaultMessage="Level {level}"
      values={{ level: level }}
    />
  );
}
