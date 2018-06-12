// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import UniversalCookie from 'universal-cookie';

const JWT_KEY = 'jwt';

const Cookie = () => new UniversalCookie();

export function getTokenFromLocalCookie() {
  return Cookie().get(JWT_KEY);
}
