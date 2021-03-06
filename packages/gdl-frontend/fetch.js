// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';
import { getAuthToken } from 'gdl-auth';

import type { Translation, ConfigShape, RemoteData, Locale } from './types';

const { publicRuntimeConfig, serverRuntimeConfig }: ConfigShape = getConfig();

// NB! Must be a function, don't pull it out into a constant here.
// bookApiUrl is actually a getter on the server, and we want it to be resolved each time it is accessed
const bookApiUrl = () =>
  (serverRuntimeConfig && serverRuntimeConfig.bookApiUrl) ||
  publicRuntimeConfig.bookApiUrl;

const siteTranslationUrl = () =>
  (serverRuntimeConfig && serverRuntimeConfig.siteTranslationServiceUrl) ||
  publicRuntimeConfig.siteTranslationServiceUrl;

/*
 * Wrap fetch with some error handling and automatic json parsing
 */
async function doFetch(
  url: string,
  options: ?{
    method: 'POST' | 'GET' | 'PUT',
    body: ?any
  }
): Promise<RemoteData<any>> {
  const token = typeof window !== 'undefined' ? getAuthToken() : undefined;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : null
      },
      ...options
    });

    let result;
    const header: ?string = response.headers.get('Content-Type');
    if (header && header.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (response.ok) {
      return {
        data: result,
        isOk: true,
        statusCode: response.status
      };
    }

    return {
      error: result,
      isOk: false,
      statusCode: response.status
    };
  } catch (error) {
    // Make sure we always return something. So we don't have to catch exceptions in our components
    // Usually we should only get here if the network is down or times out
    return {
      error,
      isOk: false,
      statusCode: 500 // other code
    };
  }
}

// DO NOT declare doFetch and export it as default as the same time
// See https://github.com/babel/babel/issues/6262
export default doFetch;

export function sendToTranslation(
  bookId: number | string,
  fromLanguage: string,
  toLanguage: string
): Promise<RemoteData<Translation>> {
  return doFetch(`${bookApiUrl()}/translations`, {
    method: 'POST',
    body: JSON.stringify({ bookId, fromLanguage, toLanguage })
  });
}

export function fetchSiteTranslation(
  languageCode: string
): Promise<RemoteData<Locale>> {
  return doFetch(`${siteTranslationUrl()}/${languageCode}`);
}
