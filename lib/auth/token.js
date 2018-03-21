// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import Cookie from 'js-cookie';
import lscache from 'lscache';
import type { $Request } from 'express';

const AUTH_ACCESS_TOKEN_KEY = 'auth-access-token';
export const LOGOUT_KEY = 'logout';

// Returns a date with time = now() + number of seconds
const expirationDate = (seconds: number) =>
  new Date(seconds * 1000 + new Date().getTime());
const secondsToMinutes = (seconds: number) => Math.floor(seconds / 60);

/**
 * Set auth tokens (for user logging in)
 */
export function setAuthToken(token: {
  accessToken: string,
  expiresIn: number
}) {
  if (!process.browser || token.accessToken == null) {
    return;
  }
  // lscache uses minutes for expiration, while the token TTL is in seconds
  lscache.set(
    AUTH_ACCESS_TOKEN_KEY,
    token.accessToken,
    secondsToMinutes(token.expiresIn)
  );
  Cookie.set(AUTH_ACCESS_TOKEN_KEY, token.accessToken, {
    expires: expirationDate(token.expiresIn)
  });
}

export function unsetAuthToken() {
  if (!process.browser) {
    return;
  }
  lscache.remove(AUTH_ACCESS_TOKEN_KEY);
  Cookie.remove(AUTH_ACCESS_TOKEN_KEY);

  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple tabs are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}

function getCookie(name: string, req: $Request): ?string {
  if (!req.headers.cookie) {
    return undefined;
  }

  const v = req.headers.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return v ? v[2] : null;
}

export const getAuthToken = (req?: $Request): ?string =>
  req
    ? getCookie(AUTH_ACCESS_TOKEN_KEY, req)
    : lscache.get(AUTH_ACCESS_TOKEN_KEY);
