// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import env from '../env';

test('Object with URLs', () => {
  expect(env).toEqual(
    expect.objectContaining({
      bookApiUrl: expect.any(String),
    }),
  );
});
