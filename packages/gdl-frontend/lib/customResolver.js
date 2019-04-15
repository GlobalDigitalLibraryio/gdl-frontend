// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

// This module is Node only. Ignored on the client in package.json
const dns = require('dns');

let address;
let expires;

/**
 * Use Node's dns module to resolve a hostname and cache resulting address.
 *
 * Fallsback to regular unresolved address while the hostname is still unresolved.
 * @param {string} hostname
 * @param {string} pathname
 */
function customResolver(hostname /*: string */, pathname /*: string */) {
  if (address && expires > Date.now()) {
    return address;
  }

  // $FlowFixMe: Flow isn't updated with latest type signature for the resolve4 method
  dns.resolve4(hostname, { ttl: true }, (err, addresses) => {
    if (!err && addresses && addresses[0]) {
      const { ttl, address: ip } = addresses[0];

      expires = ttl * 1000 + Date.now();
      address = `http://${ip}${pathname}`;
    }
  });

  return `http://${hostname}${pathname}`;
}

module.exports = customResolver;
