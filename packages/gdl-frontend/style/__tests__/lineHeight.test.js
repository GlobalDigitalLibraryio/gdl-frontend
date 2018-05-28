// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import lineHeight from '../lineHeight';

test('Returns pixel values', () => {
  expect(lineHeight({ lineHeight: 18 })).toMatchSnapshot();
});

test('Returns string values', () => {
  expect(lineHeight({ lineHeight: '3em' })).toMatchSnapshot();
});

test('Returns responsive values', () => {
  expect(lineHeight({ lineHeight: [18, 20] })).toMatchSnapshot();
});
