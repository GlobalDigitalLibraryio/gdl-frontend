// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import lscache from 'lscache';
import { clientAuth } from '../../config';

// Dynamic import to reduce bundle size. Should shave off about > 100 KB (uncompressed)
const auth0 = import('auth0-js');

export const getRedirectUrl = () => lscache.get('REDIRECT_AFTER_LOGIN');

const getAuth = async options => {
  const auth = await auth0;

  return new auth.WebAuth({
    clientID: clientAuth.clientId,
    audience: clientAuth.audience,
    domain: clientAuth.domain,
    responseType: 'token id_token',
    scope: 'openid profile',
    redirectUri: `${getBaseUrl()}/auth/signed-in`,
    options
  });
};

/**
 * If hash not provided, window.location.hash will be used by default
 */
export async function parseHash(
  hash: ?string
): Promise<{ accessToken: string, idToken: string, expiresIn: number }> {
  const auth0 = await getAuth();

  return new Promise((resolve, reject) => {
    auth0.parseHash({ hash }, (err, authResult) => {
      if (!err) {
        resolve(authResult);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Login using one of the social providers
 */
export async function loginSocialMedia(type: 'facebook' | 'google-oauth2') {
  (await getAuth()).authorize({
    connection: type
  });
}

/**
 * Returns the index/home URL
 */
const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`;

/**
 * Logs out and redirects to the index/home page
 */
export const logout = async () => {
  (await getAuth()).logout({ returnTo: getBaseUrl() });
};
