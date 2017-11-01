// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { bookApiUrl } from '../env';

test('Exports book api url', () => {
  expect(bookApiUrl).toEqual(expect.any(String));
});
