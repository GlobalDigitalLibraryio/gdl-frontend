// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { unsetJwtToken } from 'gdl-auth';

export const LOGOUT_KEY = 'logout';

export function unsetToken() {
  unsetJwtToken();
  // Listen on this in defaultPage HoC. Triggers logout in every tab if multiple tabs are open
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
}
