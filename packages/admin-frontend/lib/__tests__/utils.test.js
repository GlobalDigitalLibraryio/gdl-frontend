// @flow

import isEmptyString from '../isEmptyString';
import { parseQuery } from '../parseQuery';

test('Parsing of valid query with number parameters', () => {
  expect(
    parseQuery('?cropStartX=10&cropEndX=20&cropStartY=10&cropEndY=20')
  ).toEqual({
    cropStartX: 10,
    cropEndX: 20,
    cropStartY: 10,
    cropEndY: 20
  });
});

test('Parsing of valid query with string and number parameters', () => {
  expect(
    parseQuery('?cropStartX=10&cropEndX=test&cropStartY=me&cropEndY=20')
  ).toEqual({
    cropStartX: 10,
    cropEndX: 'test',
    cropStartY: 'me',
    cropEndY: 20
  });
});

test('Parsing of valid query with single argument', () => {
  expect(parseQuery('cropStartX=10')).toEqual({
    cropStartX: 10
  });
});

test('Parsing of single invalid query parameter', () => {
  expect(parseQuery('?cropStartX=')).toEqual({});
});

test('Parsing of invalid query parameters', () => {
  expect(parseQuery('?cropStartX=10&lala')).toEqual({});
});

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
