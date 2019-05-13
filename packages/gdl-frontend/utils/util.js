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
    .split(';')
    .map(cookieStr => cookieStr.trim().split('='))
    .reduce((acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});
}

export { isEmpty, parseCookies };
