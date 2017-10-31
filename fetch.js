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
      // Check if the response is in the 200-299 range
      if (response.ok) {
        return json;
      }
    }
    const err = new Error('Remote data error');
    // $FlowFixMe Ignorore the flow error here. Should really extend the Error class, but that requires special Babel configuration. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
    err.statusCode = response.status || 500;
    throw err;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
}
