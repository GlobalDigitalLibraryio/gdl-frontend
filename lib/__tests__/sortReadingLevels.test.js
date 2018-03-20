// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import sortReadingLevels from '../sortReadingLevels';

test('Sorts the reading levels', () => {
  const input = ['decodable', '4', '1', 'read-aloud', '2', '3'];

  const expected = ['decodable', '1', '2', '3', '4', 'read-aloud'];
  expect(sortReadingLevels(input)).toEqual(expected);
});
