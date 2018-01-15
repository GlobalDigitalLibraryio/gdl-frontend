// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import Cookie from 'js-cookie';
import lscache from 'lscache';
import type { $Request, $Response } from 'express';

const ANON_ACCESS_TOKEN_KEY = 'anon-access-token';
const AUTH_ACCESS_TOKEN_KEY = 'auth-access-token';
export const LOGOUT_KEY = 'logout';

// Returns a date with time = now() + number of seconds
const expirationDate = (seconds: number) =>
  new Date(seconds * 1000 + new Date().getTime());
const secondsToMinutes = (seconds: number) => Math.floor(seconds / 60);

/**
 * Set anonymous tokens (for user not logged in)
 */
export function setAnonToken(token: {
  access_token: string,
  expires_in: number
}) {
  if (!process.browser || token.access_token == null) {
    return;
  }

  // lscache uses minutes for expiration, while the token TTL is in seconds
  lscache.set(
    ANON_ACCESS_TOKEN_KEY,
    token.access_token,
    secondsToMinutes(token.expires_in)
  );
  Cookie.set(ANON_ACCESS_TOKEN_KEY, token.access_token, {
    expires: expirationDate(token.expires_in)
  });
}

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

  // Finally, clear any anonomyous token
  lscache.remove(ANON_ACCESS_TOKEN_KEY);
  Cookie.remove(ANON_ACCESS_TOKEN_KEY);
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

export const getAnonToken = (req?: $Request): ?string =>
  req
    ? getCookie(ANON_ACCESS_TOKEN_KEY, req)
    : lscache.get(ANON_ACCESS_TOKEN_KEY);

/**
 * Returns auth token or anon token
 */
export const getAccessTokenFromLocalStorage = (): ?string =>
  getAuthToken() || getAnonToken();

/**
 * Set access token on the response via cookie
 * NB! Server only
 */
export function setAnonTokenOnResponse(
  res: $Response,
  token: { access_token: string, expires_in: number }
) {
  res.cookie(ANON_ACCESS_TOKEN_KEY, token.access_token, {
    // auth0 returns seconds, but maxAge is in ms
    maxAge: token.expires_in * 1000
  });
}
