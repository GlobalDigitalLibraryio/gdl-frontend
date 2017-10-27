// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import fetch from 'isomorphic-unfetch';

export default async function(url: string): Promise<any> {
  const response = await fetch(url);

  if (response.headers.get('Content-Type').includes('application/json')) {
    const json = await response.json();
    if (response.ok) {
      return json;
    }
  }

  return response.text();
}
