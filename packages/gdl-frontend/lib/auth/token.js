// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import UniversalCookie from 'universal-cookie';
import { unsetJwtToken } from 'gdl-auth';

const JWT_KEY = 'jwt';
export const LOGOUT_KEY = 'logout';

const Cookie = () => new UniversalCookie();

/**
 * Set auth tokens (for user logging in)
 */
export function setToken(token: { accessToken: string, expiresIn: number }) {
  if (typeof window !== 'undefined' && token.accessToken != null) {
    Cookie().set(JWT_KEY, token.accessToken, {
      maxAge: token.expiresIn,
      path: '/'
    });
  }
}

export function unsetToken() {
  unsetJwtToken();
  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple tabs are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}

export function getTokenFromLocalCookie() {
  return Cookie().get(JWT_KEY);
}
