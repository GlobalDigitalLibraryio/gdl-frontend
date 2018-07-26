// @flow

export function parseQuery(queryString: string) {
  const pairs = (queryString[0] === '?'
    ? queryString.substring(1)
    : queryString
  ).split('&');

  return pairs.reduce((accumulator, pair) => {
    if (!pair.match('.+=.+')) {
      return null;
    }

    const [key, value] = pair.split('=');
    //$FlowFixMe the key cannot be null because we know that the pair will match the above regex at this point
    accumulator[key] = parseInt(value, 10) || value;
    return accumulator;
  }, {});
}
