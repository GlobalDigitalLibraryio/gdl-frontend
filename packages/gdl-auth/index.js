// @flow
import type { $Request } from 'express';
import jwtDecode from 'jwt-decode';
import UniversalCookie from 'universal-cookie';
export { default as claims } from './claims';

const JWT_KEY = 'jwt';
const Cookie = () => new UniversalCookie();

/**
 * Check if token includes a particular claim is in scope
 * @param claim For instance, 'books-staging:write'
 * @param req Optional Express request object (for SSR)
 */
export function hasClaim(claim: string, req: ?$Request): boolean {
  const jwt = req ? req.cookies[JWT_KEY] : Cookie().get(JWT_KEY);

  if (!jwt) {
    return false;
  }
  const decoded = jwtDecode(jwt);

  return decoded.scope && decoded.scope.includes(claim);
}
