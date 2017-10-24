// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import maxWidth from '../maxWidth';

test('Returns pixel values', () => {
  expect(maxWidth({ mw: 200 })).toMatchSnapshot();
});

test('Returns string values', () => {
  expect(maxWidth({ mw: '100%' })).toMatchSnapshot();
});

test('Returns responsive values', () => {
  expect(maxWidth({ mw: [50, 100] })).toMatchSnapshot();
});
