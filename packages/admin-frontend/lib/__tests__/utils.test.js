// @flow

import isEmptyString from '../isEmptyString';
import formatMostReadDataToObjects from '../utils';

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

describe('Test formatMostReadDataToObjects function', () => {
  const testString = formatMostReadDataToObjects(
    'Count,Title\n123,My fish, oh no\n222,Dogs\n333,cats'
  );
  test('That the formatted list should have a length of 3', () => {
    expect(testString.length).toBeLessThanOrEqual(3);
  });

  test('That the formatted list should objects with count and title', () => {
    expect(testString).toEqual([
      { count: '123', title: 'My fish, oh no' },
      { count: '222', title: 'Dogs' },
      { count: '333', title: 'cats' }
    ]);
  });

  test('That "Count,Title" should return empty list', () => {
    expect(formatMostReadDataToObjects('Count,Title')).toEqual([]);
  });
});
