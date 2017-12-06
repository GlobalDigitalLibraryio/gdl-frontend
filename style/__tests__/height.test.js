// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import height from '../height';

test('Returns pixel values', () => {
  expect(height({ h: 200 })).toMatchSnapshot();
});

test('Returns string values', () => {
  expect(height({ h: '100%' })).toMatchSnapshot();
});

test('Returns responsive values', () => {
  expect(height({ h: [50, 100] })).toMatchSnapshot();
});
