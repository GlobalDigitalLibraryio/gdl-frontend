// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 @PROJECT@
 *
 * See LICENSE
 */

const fetch = require('isomorphic-unfetch');
const config = require('../../config');


async function getToken() {
  const tokenRes = await fetch(config.serverAuth.authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audience: config.serverAuth.audience,
      grant_type: 'client_credentials',
      client_id: config.serverAuth.clientId,
      client_secret: config.serverAuth.clientSecret,
    }),
  });

  return tokenRes.json();
}

module.exports = {
  getToken,
};
