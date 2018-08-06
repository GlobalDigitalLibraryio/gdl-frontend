// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { unsetAuthToken } from 'gdl-auth';

export const LOGOUT_KEY = 'logout';

export function unsetToken() {
  unsetAuthToken();
  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple tabs are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}
