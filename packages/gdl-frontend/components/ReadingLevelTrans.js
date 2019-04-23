// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';
import type { ReadingLevel } from '../gqlTypes';

type Props = {|
  readingLevel: ReadingLevel | 'Games'
|};

export default function ReadingLevelTrans({ readingLevel: level }: Props) {
  if (level === 'Decodable') {
    return <Trans>Decodable</Trans>;
  } else if (level === 'ReadAloud') {
    return <Trans>Read aloud</Trans>;
  } else if (level === 'Level1') {
    return <Trans>Level 1</Trans>;
  } else if (level === 'Level2') {
    return <Trans>Level 2</Trans>;
  } else if (level === 'Level3') {
    return <Trans>Level 3</Trans>;
  } else if (level === 'Level4') {
    return <Trans>Level 4</Trans>;
  }
  return level;
}
