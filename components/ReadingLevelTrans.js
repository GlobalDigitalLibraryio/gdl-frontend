// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';
import type { ReadingLevel } from '../types';

type Props = {|
  readingLevel: ReadingLevel
|};

export default function ReadingLevelTrans({ readingLevel }: Props) {
  if (readingLevel === 'decodable') {
    return <Trans>Decodable</Trans>;
  } else if (readingLevel === 'read-aloud') {
    return <Trans>Read aloud</Trans>;
  }
  return <Trans>Level {readingLevel}</Trans>;
}
