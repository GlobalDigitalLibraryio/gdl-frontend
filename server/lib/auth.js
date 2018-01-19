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
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      audience: config.serverAuth.audience,
      grant_type: 'client_credentials',
      client_id: config.serverAuth.clientId,
      client_secret: config.serverAuth.clientSecret
    })
  });

  return tokenRes.json();
}

/* function setToken(
  res: $Response,
  token: { access_token: string, expires_in: number }
) {
  res.cookie(ANON_ACCESS_TOKEN_KEY, token.access_token, {
    // auth0 returns seconds, but maxAge is in ms
    maxAge: token.expires_in * 1000
  });
} */

module.exports = {
  getToken
  // setToken
};
