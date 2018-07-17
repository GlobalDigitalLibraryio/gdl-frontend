// @flow
import type { $Request } from 'express';
import jwtDecode from 'jwt-decode';
import UniversalCookie from 'universal-cookie';
import { clientAuth } from './config';

// Dynamic import to reduce bundle size. Should shave off about > 100 KB (uncompressed)
const auth0 = import('auth0-js');

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

export function hasAuthToken(req: ?$Request): boolean { // TODO: simplify
  const jwt = getAuthToken(req);

  if (!jwt) {
    return false;
  }
  return true;
}

/**
 * Read the JWT auth token from cookies.
 * @param req Optional Express request object (for SSR)
 */
export function getAuthToken(req: ?$Request): ?string {
  return req ? req.cookies[JWT_KEY] : Cookie().get(JWT_KEY);
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

/**
 * Log out used in admin
 * redirect path to '/' and remove JWT auth token
 */
export function logout() {
  if (!process.browser) {
    return;
  }
  Cookie().remove(JWT_KEY, { path: '/' });
}




/**  --------------- LOGIN REDIRECT -------------------  */

// Dynamic import to reduce bundle size. Should shave off about > 100 KB (uncompressed)

/**
 * Returns the index/home URL
 */
export const getBaseUrl = () =>
  `${window.location.protocol}//${window.location.host}`;

export const getAuth = async options => {
  const auth = await auth0;

  return new auth.WebAuth({
    clientID: clientAuth.clientId,
    audience: clientAuth.audience,
    domain: clientAuth.domain,
    responseType: 'token id_token',
    scope: 'openid profile',
    redirectUri: `${getBaseUrl()}/auth/signed-in`,
    options
  });
};

/**
 * Login using one of the social providers
 */
export async function loginSocialMedia(type: 'facebook' | 'google-oauth2') {
  (await getAuth()).authorize({
    connection: type
  });
}

