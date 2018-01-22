// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import Cookie from 'js-cookie';
import type { $Request } from 'express';

const SESSION_TOKEN_KEY = 'session';
const PERSONAL_TOKEN_KEY = 'personal-session';
export const LOGOUT_KEY = 'logout';

// Returns a date with time = now() + number of seconds
const expirationDate = (seconds: number) =>
  new Date(seconds * 1000 + new Date().getTime());

/**
 * Set personal tokens (for user logging in)
 */
export function setPersonalToken(token: {
  accessToken: string,
  expiresIn: number
}) {
  if (!process.browser || token.accessToken == null) {
    return;
  }
  Cookie.set(PERSONAL_TOKEN_KEY, token.accessToken, {
    expires: expirationDate(token.expiresIn)
  });
}

export function unsetPersonalToken() {
  if (!process.browser) {
    return;
  }
  Cookie.remove(PERSONAL_TOKEN_KEY);

  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple tabs are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}

/**
 * Small util function that gets cookie value by name from the request object
 */
function getCookie(name: string, req: $Request): ?string {
  if (!req.headers.cookie) {
    return undefined;
  }

  const v = req.headers.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return v ? v[2] : null;
}

/**
 * Get the personal token. Works on both the server and the client
 * @param {*} req
 */
export const getPersonalToken = (req?: $Request): ?string =>
  req ? getCookie(PERSONAL_TOKEN_KEY, req) : Cookie.get(PERSONAL_TOKEN_KEY);

/**
 * Get the session token
 *
 * This reads from the global object on the server side :(
 */
export const getSessionToken = (): ?string =>
  process.browser ? Cookie.get(SESSION_TOKEN_KEY) : global.sessionAccessToken;
