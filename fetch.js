// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import fetch from 'isomorphic-unfetch';
import { bookApiUrl } from './env';
import type { RemoteData, Language, Book } from './types';

/*
* Wrap fetch with some error handling and automatic json parsing
*/
async function doFetch(url: string): Promise<RemoteData<any>> {
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

export default doFetch;

// Default page size
const PAGE_SIZE = 5;

export function fetchLevels(
  language: ?string,
): Promise<RemoteData<Array<string>>> {
  return doFetch(`${bookApiUrl}/levels/${language || ''}`);
}

export function fetchLanguages(): Promise<RemoteData<Array<Language>>> {
  return doFetch(`${bookApiUrl}/languages`);
}

export function fetchEditorPicks(
  language: ?string,
): Promise<RemoteData<Array<Book>>> {
  return doFetch(`${bookApiUrl}/editorpicks/${language || ''}`);
}

export function fetchBook(
  id: string | number,
  language: string,
): Promise<RemoteData<Book>> {
  return doFetch(`${bookApiUrl}/books/${language}/${id}`);
}

export function fetchSimilarBooks(
  id: string | number,
  language: string,
): Promise<RemoteData<{ results: Array<Book> }>> {
  return doFetch(
    `${bookApiUrl}/books/${language}/similar/${id}?page-size=${PAGE_SIZE}`,
  );
}

export function fetchJustArrivedBooks(
  language: ?string,
): Promise<RemoteData<{ results: Array<Book> }>> {
  return doFetch(
    `${bookApiUrl}/books/${language ||
      ''}?sort=-arrivaldate&page-size=${PAGE_SIZE}`,
  );
}

export function fetchBooksByLevel(
  level: string,
  language: ?string,
): Promise<RemoteData<{ results: Array<Book> }>> {
  return doFetch(
    `${bookApiUrl}/books/${language ||
      ''}?sort=-arrivaldate&page-size=${PAGE_SIZE}&reading-level=${level}`,
  );
}
