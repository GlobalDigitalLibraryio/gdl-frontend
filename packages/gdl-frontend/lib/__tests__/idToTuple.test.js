import idToTuple from '../idToTuple';

test('it should extract the bookId and languagecode from the composed id', () => {
  expect(idToTuple('17-en')).toEqual({ bookId: '17', language: 'en' });
});
