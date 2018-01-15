// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import auth0 from 'auth0-js';
import { clientAuth } from '../../config';

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`;

const getAuth = options =>
  new auth0.WebAuth({
    clientID: clientAuth.clientId,
    audience: clientAuth.audience,
    domain: clientAuth.domain,
    responseType: 'token id_token',
    scope: 'openid profile',
    redirectUri: `${getBaseUrl()}/auth/signed-in`,
    options
  });

/**
 * If hash not provided, window.location.hash will be used by default
 */
export function parseHash(
  hash: ?string
): Promise<{ accessToken: string, idToken: string, expiresIn: number }> {
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
    connection: type
  });
}

export const logout = () => getAuth().logout({ returnTo: getBaseUrl() });
