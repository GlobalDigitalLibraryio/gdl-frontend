// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import lscache from 'lscache';
import { clientAuth } from '../../config';
// Dynamic import to reduce bundle size
const auth0 = import('auth0-js');

export const setRedirectUrl = (path: { asPath: string, pathname: string }) =>
  lscache.set('REDIRECT_AFTER_LOGIN', path, 5);

export const getRedirectUrl = () => lscache.get('REDIRECT_AFTER_LOGIN');

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

export async function loginSocialMedia(type: 'facebook' | 'google-oauth2') {
  (await getAuth()).authorize({
    connection: type
  });
}

export const logout = async () => {
  (await getAuth()).logout({ returnTo: getBaseUrl() });
};
