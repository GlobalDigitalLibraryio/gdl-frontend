// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import type { $Request } from 'express';
import Cookie from 'js-cookie';

const JWT_KEY = 'jwt';
export const LOGOUT_KEY = 'logout';

// Returns a date with time = now() + number of seconds
const expirationDate = (seconds: number) =>
  new Date(seconds * 1000 + new Date().getTime());

/**
 * Set auth tokens (for user logging in)
 */
export function setToken(token: { accessToken: string, expiresIn: number }) {
  if (!process.browser || token.accessToken == null) {
    return;
  }
  Cookie.set(JWT_KEY, token.accessToken, {
    expires: expirationDate(token.expiresIn)
  });
}

export function unsetToken() {
  if (!process.browser) {
    return;
  }

  Cookie.remove(JWT_KEY);
  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple tabs are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}

export function getTokenFromServerCookie(req: $Request) {
  if (!req.headers.cookie) {
    return undefined;
  }
  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith(`${JWT_KEY}=`));
  if (!jwtCookie) {
    return undefined;
  }
  const jwt = jwtCookie.split('=')[1];
  return jwt;
}

export function getTokenFromLocalCookie() {
  return Cookie.get(JWT_KEY);
}
