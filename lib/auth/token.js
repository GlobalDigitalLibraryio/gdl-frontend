// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import lscache from 'lscache';

const AUTH_ACCESS_TOKEN_KEY = 'auth-access-token';
export const LOGOUT_KEY = 'logout';

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
}

export function unsetAuthToken() {
  if (!process.browser) {
    return;
  }
  lscache.remove(AUTH_ACCESS_TOKEN_KEY);

  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple tabs are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}

export const getAuthToken = (): ?string => {
  if (!process.browser) return null;
  return lscache.get(AUTH_ACCESS_TOKEN_KEY);
};
