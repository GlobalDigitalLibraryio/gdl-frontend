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
  const jwt = getAuthToken(req);

  if (!jwt) {
    return false;
  }
  const decoded = jwtDecode(jwt);

  return decoded.scope && decoded.scope.includes(claim);
}

/**
 * Get username from JWT auth token
 * @param req Optional Express request object (for SSR)
 */
export function getUserName(req: ?$Request): ?string {
  const jwt = getAuthToken(req);
  if (!jwt) {
    return;
  }
  const decoded = jwtDecode(jwt);

  return decoded['https://digitallibrary.io/user_name'];
}

export function hasAuthToken(req: ?$Request): boolean {
  return Boolean(getAuthToken(req));
}

/**
 * Read the JWT auth token from cookies.
 * @param req Optional Express request object (for SSR)
 */
export function getAuthToken(req: ?$Request): ?string {
  return req ? req.cookies[JWT_KEY] : Cookie().get(JWT_KEY);
}

/**
 * Unset token to log out of admin
 * redirect path to '/' and remove JWT auth token
 */
export function unsetAuthToken() {
  if (typeof window !== 'undefined') {
    Cookie().remove(JWT_KEY, { path: '/' });
  }
}

/**
 * Set auth tokens (for user logging in)
 */
export function setAuthToken(token: {
  accessToken: string,
  expiresIn: number
}) {
  if (typeof window !== 'undefined' && token.accessToken != null) {
    Cookie().set(JWT_KEY, token.accessToken, {
      maxAge: token.expiresIn,
      path: '/'
    });
  }
}
