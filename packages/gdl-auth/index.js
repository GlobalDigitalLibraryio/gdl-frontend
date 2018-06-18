// @flow
import type { $Request } from 'express';
import jwtDecode from 'jwt-decode';
import UniversalCookie from 'universal-cookie';

const JWT_KEY = 'jwt';
const Cookie = () => new UniversalCookie();

/**
 * Check if token includes a particular claim
 * @param {string} claim For instance, 'books-staging:write'
 */
export function hasClaim(claim: string, req: ?$Request) {
  const jwt = req ? req.cookies[JWT_KEY] : Cookie().get(JWT_KEY);

  if (!jwt) {
    return false;
  }

  const decoded = jwtDecode(jwt);
  return decoded.scope && decoded.scope.includes(claim);
}

export const claims = {
  writeBook: `books-test:write`,
  writeImage: `images-test:write`
};
