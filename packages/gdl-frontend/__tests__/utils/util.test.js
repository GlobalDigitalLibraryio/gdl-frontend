// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import { isEmpty } from '../../utils/util';

describe('isEmpty(obj) function', () => {
  test('isEmpty({}) is true', () => {
    expect(isEmpty({})).toBeTruthy();
  });

  test('isEmpty({a: "b"}) is false', () => {
    expect(isEmpty({ a: 'b' })).toBeFalsy();
  });
});
