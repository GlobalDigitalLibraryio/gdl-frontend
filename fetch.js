// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import fetch from 'isomorphic-unfetch';
import Router from 'next/router';
import type {
  RemoteData,
  Language,
  Book,
  FeaturedContent,
  Translation
} from './types';
import { bookApiUrl } from './config';
import { getSsrToken, getPersonalToken } from './lib/auth/token';

/*
* Wrap fetch with some error handling and automatic json parsing
* Also ensures we have a valid access token.
*/
async function doFetch(
  url: string,
  options: ?{
    method: 'POST' | 'GET',
    body: ?any
  },
  token: ?string = getSsrToken()
): Promise<RemoteData<any>> {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : null
      },
      ...options
    });

    if (response.headers.get('Content-Type').includes('application/json')) {
      const json = await response.json();
      // Check if the response is in the 200-299 range
      if (response.ok) {
        return json;
      }
    }
    const err = new Error('Remote data error');
    // $FlowFixMe Ignore the flow error here. Should really extend the Error class, but that requires special Babel configuration. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
    err.statusCode = response.status || 500;
    throw err;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
}

export default doFetch;

// Default page size
const PAGE_SIZE = 5;

type Options = {
  pageSize?: number,
  level?: string,
  sort?: 'arrivaldate' | '-arrivaldate' | 'id' | '-id' | 'title' | '-title',
  page?: number
};

export function fetchLevels(
  language: ?string
): Promise<RemoteData<Array<string>>> {
  return doFetch(`${bookApiUrl}/levels/${language || ''}`);
}

export function fetchLanguages(): Promise<RemoteData<Array<Language>>> {
  return doFetch(`${bookApiUrl}/languages`);
}

export function fetchFeaturedContent(
  language: ?string
): Promise<RemoteData<Array<FeaturedContent>>> {
  return doFetch(`${bookApiUrl}/featured/${language || ''}`);
}

export function fetchBook(
  id: string | number,
  language: string
): Promise<RemoteData<Book>> {
  return doFetch(`${bookApiUrl}/books/${language}/${id}`);
}

export function fetchSimilarBooks(
  id: string | number,
  language: string
): Promise<RemoteData<{ results: Array<Book> }>> {
  return doFetch(
    `${bookApiUrl}/books/${language}/similar/${id}?sort=-arrivaldate&page-size=${PAGE_SIZE}`
  );
}

export function fetchBooks(
  language: ?string,
  options: Options = {}
): Promise<
  RemoteData<{
    results: Array<Book>,
    language: Language,
    page: number,
    totalCount: number
  }>
> {
  return doFetch(
    `${bookApiUrl}/books/${language || ''}?page=${options.page ||
      1}&sort=${options.sort || '-arrivaldate'}&page-size=${options.pageSize ||
      PAGE_SIZE}${options.level ? `&reading-level=${options.level}` : ''}`
  );
}

export function fetchSupportedLanguages(): Promise<
  RemoteData<Array<Language>>
> {
  return doFetch(`${bookApiUrl}/translations/supported-languages`);
}

export function fetchMyTranslations(): Promise<RemoteData<Array<Book>>> {
  const personalToken = getPersonalToken();

  if (!personalToken) {
    Router.push('/auth/sign-in');
  }

  return doFetch(`${bookApiUrl}/books/mine`, null, personalToken);
}

export function sendToTranslation(
  bookId: number | string,
  fromLanguage: string,
  toLanguage: string
): Promise<RemoteData<Translation>> {
  const personalToken = getPersonalToken();

  if (!personalToken) {
    Router.push('/auth/sign-in');
  }

  return doFetch(
    `${bookApiUrl}/translations`,
    {
      method: 'POST',
      body: JSON.stringify({ bookId, fromLanguage, toLanguage })
    },
    personalToken
  );
}
