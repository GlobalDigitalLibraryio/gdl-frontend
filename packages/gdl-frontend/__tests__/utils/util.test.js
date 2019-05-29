// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import { isEmpty, parseCookies } from '../../utils/util';

describe('isEmpty(obj) function', () => {
  test('isEmpty({}) is true', () => {
    expect(isEmpty({})).toBeTruthy();
  });

  test('isEmpty({a: "b"}) is false', () => {
    expect(isEmpty({ a: 'b' })).toBeFalsy();
  });
});

describe('parseCookies(str) function', () => {
  test('parseCookies("a=b; c=d;") should be {a: b, c: d}', () => {
    expect(parseCookies('a=b; c=d;')).toEqual({ a: 'b', c: 'd' });
  });
  test('parseCookies(null) should be null', () => {
    expect(parseCookies(null)).toEqual(null);
  });
});
