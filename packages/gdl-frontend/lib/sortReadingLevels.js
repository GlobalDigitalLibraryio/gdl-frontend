// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import type { ReadingLevel } from '../types';

/**
 * We want readingLevels to be 'decodable', numbered and then read-aloud
 */
export default function sortReadingLevels(
  readingLevels: Array<ReadingLevel> = []
) {
  const sorted = readingLevels
    .slice()
    .filter(l => l !== 'decodable' && l !== 'read-aloud')
    .sort();

  if (readingLevels.includes('decodable')) {
    sorted.unshift('decodable');
  }

  if (readingLevels.includes('read-aloud')) {
    sorted.push('read-aloud');
  }

  return sorted;
}
