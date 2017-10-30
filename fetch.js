// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import fetch from 'isomorphic-unfetch';
import type { RemoteData } from './types';

/*
* Wrap fetch with some error handling and automatic json parsing
*/
export default async function(url: string): Promise<RemoteData<*>> {
  try {
    const response = await fetch(url);

    if (response.headers.get('Content-Type').includes('application/json')) {
      const json = await response.json();
      if (response.ok) {
        return { sucess: true, results: json };
      }
      return {
        statusCode: response.status,
        description: json.description || 'Unknown error',
        code: json.code || 'Unknown error',
        sucess: false,
      };
    }

    return { sucess: true, results: await response.text() };
  } catch (error) {
    // If we are here, it is probably a network error. Treat errors without a response as 500s
    const statusCode = error.response ? error.response.status : 500;
    return {
      statusCode,
      description: error.message || 'Uknown error',
      code: 'Unknown error',
      sucess: false,
    };
  }
}
