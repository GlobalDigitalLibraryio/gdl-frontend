// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import getConfig from 'next/config';
import type { ConfigShape } from '../../types';

// Dynamic import to reduce bundle size. Should shave off about > 100 KB (uncompressed)
const auth0 = import('auth0-js');

const {
  publicRuntimeConfig: { AUTH0 }
}: ConfigShape = getConfig();

const getAuth = async (options, redirectUri?: string) => {
  const auth = await auth0;

  return new auth.WebAuth({
    clientID: AUTH0.clientId,
    audience: AUTH0.audience,
    domain: AUTH0.domain,
    responseType: 'token id_token',
    scope: 'openid profile',
    redirectUri: redirectUri
      ? `${getBaseUrl()}/auth/signed-in?next=${encodeURIComponent(redirectUri)}`
      : `${getBaseUrl()}/auth/signed-in`,
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
export async function loginSocialMedia(
  type: 'facebook' | 'google-oauth2',
  redirectUri?: string
) {
  (await getAuth(null, redirectUri)).authorize({
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
