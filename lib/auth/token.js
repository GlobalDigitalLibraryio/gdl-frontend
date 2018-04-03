// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import type { $Request } from 'express';
import Cookie from 'cookie-dough';

const JWT_KEY = 'jwt';
export const LOGOUT_KEY = 'logout';

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

  Cookie().remove(JWT_KEY);
  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple tabs are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}

export function getTokenFromServerCookie(req: $Request) {
  return Cookie(req).get(JWT_KEY);
}

export function getTokenFromLocalCookie() {
  return Cookie().get(JWT_KEY);
}
