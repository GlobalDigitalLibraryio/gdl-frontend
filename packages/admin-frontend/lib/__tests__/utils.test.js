// @flow

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
  expect(parseQuery('?cropStartX=')).toEqual(null);
});

test('Parsing of invalid query parameters', () => {
  expect(parseQuery('?cropStartX=10&lala')).toEqual(null);
});
