// @flow

export default function(id: string): { bookId: string, language: string } {
  const splits = id.split('-', 2);

  return {
    bookId: splits[0],
    language: splits[1]
  };
}
