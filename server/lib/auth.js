// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 @PROJECT@
 *
 * See LICENSE
 */

const fetch = require('isomorphic-unfetch');

const URL = 'https://digitallibrary.eu.auth0.com/oauth/token';
const CLIENT_ID = process.env.GDL_AUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GDL_AUTH_CLIENT_SECRET;


async function getToken() {
  const tokenRes = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audience: 'gdl_system',
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  return tokenRes.json();
}

module.exports = {
  getToken,
};
