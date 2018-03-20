// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import mapValues from '../mapValues';

test('Sorts the reading levels', () => {
  const users = {
    fred: { user: 'fred', age: 40 },
    pebbles: { user: 'pebbles', age: 1 }
  };

  const expected = { fred: 40, pebbles: 1 };

  const result = mapValues(users, function(o) {
    return o.age;
  });

  expect(result).toEqual(expected);
});
