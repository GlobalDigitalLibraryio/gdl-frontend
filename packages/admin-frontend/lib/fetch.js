// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import UniversalCookie from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import fetch from 'isomorphic-fetch';

const JWT_KEY = 'jwt';

const Cookie = () => new UniversalCookie();




export function getTokenFromLocalCookie() {
  return Cookie().get(JWT_KEY);
}
