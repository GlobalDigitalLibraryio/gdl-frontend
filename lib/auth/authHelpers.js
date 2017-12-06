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
}

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
  window.localStorage.removeItem('id_token');
  // Cookie.remove('jwt');

  window.localStorage.settem('logout', Date.now());
}

const getAuth = options =>
  new auth0.WebAuth({
    clientID: 'Hf3lgXrS71nxiiEaHAyRZ3GncgeE2pq5',
    audience: 'gdl_system',
    domain: 'digitallibrary.eu.auth0.com',
    responseType: 'token',
    redirectUri: `${getBaseUrl()}/login/success`,
    options,
  });

export function loginSocialMedia(type: 'facebook' | 'google-oauth2') {
  getAuth().authorize({
    connection: type,
    clientID: 'Hf3lgXrS71nxiiEaHAyRZ3GncgeE2pq5',
  });
}

export const logout = () => getAuth().logout({ returnTo: getBaseUrl() });
