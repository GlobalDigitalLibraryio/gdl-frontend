// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import type { $Request } from 'express';
import UniversalCookie from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import { GDL_ENVIRONMENT } from '../../config';

const JWT_KEY = 'jwt';
export const LOGOUT_KEY = 'logout';

const Cookie = () => new UniversalCookie();

/**
 * Set auth tokens (for user logging in)
 */
export function setToken(token: { accessToken: string, expiresIn: number }) {
  if (!process.browser || token.accessToken == null) {
    return;
  }
  Cookie().set(JWT_KEY, token.accessToken, {
    maxAge: token.expiresIn,
    path: '/'
  });
}

export function unsetToken() {
  if (!process.browser) {
    return;
  }
  Cookie().remove(JWT_KEY, { path: '/' });
  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple tabs are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}

export function getTokenFromServerCookie(req: $Request) {
  return req.cookies[JWT_KEY];
}

export function getTokenFromLocalCookie() {
  return Cookie().get(JWT_KEY);
}

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
  writeBook: `books-${GDL_ENVIRONMENT}:write`,
  writeImage: `images-${GDL_ENVIRONMENT}:write`
};
