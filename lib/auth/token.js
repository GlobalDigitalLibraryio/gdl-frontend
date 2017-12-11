// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import Cookie from 'js-cookie';
import lscache from 'lscache';

const ANON_ACCESS_TOKEN_KEY = 'anon-access-token';
const AUTH_ACCESS_TOKEN_KEY = 'auth-access-token';
export const LOGOUT_KEY = 'logout';

/**
 * Set anonymous tokens (for user not logged in)
 */
export function setAnonToken(token: {
  access_token: string,
  expires_in: number,
}) {
  if (!process.browser || token.access_token == null) {
    return;
  }

  // The anon token has an expiration time (in seconds), so turn it into a datetime in the form of milliseconds
  const expirationInMs = token.expires_in * 1000 + new Date().getTime();
  // lscache uses minutes for expiration, while the token TTL is in seconds
  lscache.set(ANON_ACCESS_TOKEN_KEY, token.access_token, Math.floor(token.expires_in / 60));
  Cookie.set(ANON_ACCESS_TOKEN_KEY, token.access_token, {
    expires: new Date(expirationInMs),
  });
}

/**
 * Set auth tokens (for user logging in)
 */
export function setAuthToken(token: { accessToken: string, expiresIn: number }) {
  if (!process.browser || token.accessToken == null) {
    return;
  }
  const expirationInMs = token.expiresIn * 1000 + new Date().getTime();
  // lscache uses minutes for expiration, while the token TTL is in seconds
  lscache.set(AUTH_ACCESS_TOKEN_KEY, token.accessToken, Math.floor(token.expiresIn / 60));
  Cookie.set(AUTH_ACCESS_TOKEN_KEY, token.accessToken, {
    expires: new Date(expirationInMs),
  });

  // Finally, clear any anonomyous token
  lscache.remove(ANON_ACCESS_TOKEN_KEY);
  Cookie.remove(ANON_ACCESS_TOKEN_KEY);
}

/**
 * Returns auth token or anon token
 */
export const getAccessTokenFromLocalStorage = (): ?string => {
  if (!process.browser) {
    return null;
  }
  return lscache.get(AUTH_ACCESS_TOKEN_KEY) || lscache.get(ANON_ACCESS_TOKEN_KEY);
};

export const getAuthTokenTokenFromLocalStorage = (): ?string => {
  if (!process.browser) {
    return null;
  }
  return lscache.get(AUTH_ACCESS_TOKEN_KEY);
};

export function unsetAuthToken() {
  if (!process.browser) {
    return;
  }
  lscache.remove(AUTH_ACCESS_TOKEN_KEY);
  Cookie.remove(AUTH_ACCESS_TOKEN_KEY);

  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}

/**
 * Given a request, get the accessToken from the cookies
 * Gets auth token first if it exists, then checks for anon token
 * NB! Server only
 */
export const getAccessTokenFromRequest = (req: any): ?string => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const splits = req.headers.cookie.split(';');

  const accessToken = splits.find(c => c.trim().startsWith(`${AUTH_ACCESS_TOKEN_KEY}=`)) || splits.find(c => c.trim().startsWith(`${ANON_ACCESS_TOKEN_KEY}=`));

  if (!accessToken) {
    return undefined;
  }
  return accessToken.split('=')[1];
};

/**
 * Set access token on the response via cookie
 * NB! Server only
 */
export function setAnonTokenOnResponse(
  res: any,
  token: { access_token: string, expires_in: number },
) {
  res.cookie(ANON_ACCESS_TOKEN_KEY, token.access_token, {
    // auth0 returns seconds, but maxAge is in ms
    maxAge: token.expires_in * 1000,
  });
}
