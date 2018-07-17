// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import lscache from 'lscache';
import { clientAuth } from '../../config';
import { getBaseUrl } from 'gdl-auth';

export const setRedirectUrl = (path: { asPath: string, pathname: string }) =>
  lscache.set('REDIRECT_AFTER_LOGIN', path, 5);

export const getRedirectUrl = () => lscache.get('REDIRECT_AFTER_LOGIN');

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
 * Logs out and redirects to the index/home page
 */
export const logout = async () => {
  (await getAuth()).logout({ returnTo: getBaseUrl() });
};
