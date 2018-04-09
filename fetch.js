// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import fetch from 'isomorphic-unfetch';
import type {
  RemoteData,
  Language,
  Book,
  BookDetails,
  FeaturedContent,
  Translation,
  Category,
  Chapter,
  ReadingLevel
} from './types';
import { bookApiUrl } from './config';
import mapValues from './lib/mapValues';
import sortReadingLevels from './lib/sortReadingLevels';
import { getTokenFromLocalCookie } from './lib/auth/token';

// Because the backend model and business logic for categories doesn't play nice together
const bookCategoryMapper = book => {
  const category: Category = book.categories.find(
    c => c.name === 'classroom_books'
  )
    ? 'classroom_books'
    : 'library_books';

  book.category = category;
  return book;
};

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
  const token = process.browser ? getTokenFromLocalCookie() : undefined;

  const response = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : null
    },
    ...options
  });

  let result;
  if (response.headers.get('Content-Type').includes('application/json')) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (!process.browser && !response.ok) {
    console.warn('Request failed', {
      url,
      method: options && options.method ? options.method : 'GET',
      status: response.status,
      response: result
    });
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
}

// DO NOT declare doFetch and export it as default as the same time
// See https://github.com/babel/babel/issues/3786
export default doFetch;

// Default page size
const PAGE_SIZE = 5;

type Options = {
  pageSize?: number,
  level?: string,
  category?: Category,
  sort?: 'arrivaldate' | '-arrivaldate' | 'id' | '-id' | 'title' | '-title',
  page?: number
};

export function fetchLanguages(): Promise<RemoteData<Array<Language>>> {
  return doFetch(`${bookApiUrl}/languages`);
}

export function fetchFeaturedContent(
  language: ?string
): Promise<RemoteData<Array<FeaturedContent>>> {
  return doFetch(`${bookApiUrl}/featured/${language || ''}`);
}

export async function fetchBook(
  id: string | number,
  language: string
): Promise<RemoteData<BookDetails>> {
  const result = await doFetch(`${bookApiUrl}/books/${language}/${id}`);

  if (result.isOk) {
    result.data = bookCategoryMapper(result.data);
  }
  return result;
}

export async function fetchSimilarBooks(
  id: string | number,
  language: string
): Promise<RemoteData<{ results: Array<Book> }>> {
  const result = await doFetch(
    `${bookApiUrl}/books/${language}/similar/${id}?sort=-arrivaldate&page-size=${PAGE_SIZE}`
  );

  if (result.isOk) {
    result.data.results = result.data.results.map(bookCategoryMapper);
  }
  return result;
}

export async function fetchBooks(
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
  const result = await doFetch(
    `${bookApiUrl}/books/${language || ''}?page=${options.page ||
      1}&sort=${options.sort || '-arrivaldate'}&page-size=${options.pageSize ||
      PAGE_SIZE}${options.level ? `&reading-level=${options.level}` : ''}${
      options.category ? `&category=${options.category}` : ''
    }`
  );

  if (result.isOk) {
    result.data.results = result.data.results.map(bookCategoryMapper);
  }
  return result;
}

export function fetchSupportedLanguages(): Promise<
  RemoteData<Array<Language>>
> {
  return doFetch(`${bookApiUrl}/translations/supported-languages`);
}

export function fetchMyTranslations(): Promise<RemoteData<Array<Translation>>> {
  return doFetch(`${bookApiUrl}/books/mine`);
}

export function sendToTranslation(
  bookId: number | string,
  fromLanguage: string,
  toLanguage: string
): Promise<RemoteData<Translation>> {
  return doFetch(`${bookApiUrl}/translations`, {
    method: 'POST',
    body: JSON.stringify({ bookId, fromLanguage, toLanguage })
  });
}

export async function search(
  query: string,
  language?: string,
  options: Options = {}
): Promise<
  RemoteData<{|
    page: number,
    totalCount: number,
    results: Array<Book>,
    language: Language
  |}>
> {
  const result = await doFetch(
    encodeURI(
      `${bookApiUrl}/search/${language ||
        ''}?query=${query}&page-size=${options.pageSize ||
        PAGE_SIZE}&page=${options.page || 1}`
    )
  );

  if (result.isOk) {
    result.data.results = result.data.results.map(bookCategoryMapper);
  }

  return result;
}

export async function fetchCategories(
  language: ?string
): Promise<
  RemoteData<{|
    classroom_books?: Array<ReadingLevel>,
    library_books?: Array<ReadingLevel>
  |}>
> {
  const result = await doFetch(`${bookApiUrl}/categories/${language || ''}`);

  // Sort the reading levels and move the data one level up
  if (result.isOk) {
    result.data = mapValues(result.data, c =>
      sortReadingLevels(c.readingLevels)
    );
  }

  return result;
}

export async function saveBook(
  book: BookDetails
): Promise<RemoteData<BookDetails>> {
  const denormalized = { ...book };
  delete denormalized['category'];
  const result = await doFetch(
    `${bookApiUrl}/books/${book.language.code}/${book.id}`,
    { method: 'PUT', body: JSON.stringify(denormalized) }
  );

  if (result.isOk) {
    result.data = bookCategoryMapper(result.data);
  }
  return result;
}

export async function saveChapter(
  book: BookDetails,
  chapter: Chapter
): Promise<RemoteData<Chapter>> {
  const result = await doFetch(
    `${bookApiUrl}/books/${book.language.code}/${book.id}/chapters/${
      chapter.id
    }`,
    { method: 'PUT', body: JSON.stringify(chapter) }
  );

  return result;
}
