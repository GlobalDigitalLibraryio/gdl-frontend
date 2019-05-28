function isEmpty(obj) {
  return !Object.keys(obj).length > 0;
}

/**
 * Function for parsing cookie string from header.
 * OBS: this does (for now) only support simple key=values (not '=' in values e.g)
 * @param string str
 */
function parseCookies(str) {
  return str
    ? str
        .split(';')
        .map(cookieStr => cookieStr && cookieStr.trim().split('='))
        .reduce((acc, curr) => {
          acc[curr[0]] = curr[1];
          return acc;
        }, {})
    : null;
}

export { isEmpty, parseCookies };
