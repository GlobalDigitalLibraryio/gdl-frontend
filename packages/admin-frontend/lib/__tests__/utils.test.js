// @flow

import isEmptyString from '../isEmptyString';

test('That " " returns empty string', () => {
  expect(isEmptyString(' ')).toEqual(true);
});

test('That many spaces returns empty string', () => {
  expect(isEmptyString('              ')).toEqual(true);
});

test('That tabs returns empty string', () => {
  expect(isEmptyString('            ')).toEqual(true);
});

test('That empty string returns empty string', () => {
  expect(isEmptyString('')).toEqual(true);
});

test('That not empty string returns false', () => {
  expect(isEmptyString('not_empty_string')).toEqual(false);
});

test('That string with spaces and tabs does not return empty string', () => {
  expect(isEmptyString('This is a   test    !')).toEqual(false);
});

test('That undefined returns empty string', () => {
  expect(isEmptyString(undefined)).toEqual(true);
});

test('That null returns empty string', () => {
  expect(isEmptyString(null)).toEqual(true);
});
