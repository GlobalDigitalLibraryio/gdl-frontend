// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import textAlign from '../textAlign';

test('Returns single value', () => {
  expect(textAlign({ textAlign: 'center' })).toMatchSnapshot();
});

test('Returns responsive values', () => {
  expect(textAlign({ textAlign: ['center', 'left'] })).toMatchSnapshot();
});
