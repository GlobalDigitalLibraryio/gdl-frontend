// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import auth0 from 'auth0-js';

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`;

const LOCAL_STORAGE_TOKEN_KEY = 'id_token';

/*
Copied from julekalender. Not needed?
const getQueryParams = () => {
  const params = {};
  window.location.href.replace(
    /([^(?|#)=&]+)(=([^&]*))?/g,
    ($0, $1, $2, $3) => {
      params[$1] = $3;
    },
  );
  return params;
};

export function extractInfoFromHash() {
  if (!process.browser) {
    return undefined;
  }
  const { access_token } = getQueryParams();
  return { token: access_token };
} */

export function setToken(token: string) {
  if (!process.browser) {
    return;
  }
  window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
  // Cookie.set('jwt', token);
}

export function unsetToken() {
  if (!process.browser) {
    return;
  }
  window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  // Cookie.remove('jwt');

  window.localStorage.setItem('logout', Date.now());
}

const getAuth = options =>
  new auth0.WebAuth({
    clientID: 'Hf3lgXrS71nxiiEaHAyRZ3GncgeE2pq5',
    audience: 'gdl_system',
    domain: 'digitallibrary.eu.auth0.com',
    responseType: 'token id_token',
    scope: 'openid profile',
    redirectUri: `${getBaseUrl()}/login/success`,
    options,
  });

/**
 * If hash not provided, window.location.hash will be used by default
 */
export function parseHash(
  hash: ?string,
): Promise<{ accessToken: string, idToken: string }> {
  return new Promise((resolve, reject) => {
    getAuth().parseHash({ hash }, (err, authResult) => {
      if (!err) {
        resolve(authResult);
      } else {
        reject(err);
      }
    });
  });
}

export function loginSocialMedia(type: 'facebook' | 'google-oauth2') {
  getAuth().authorize({
    connection: type,
  });
}

export const logout = () => getAuth().logout({ returnTo: getBaseUrl() });
