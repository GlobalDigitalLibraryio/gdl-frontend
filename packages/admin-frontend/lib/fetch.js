// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import UniversalCookie from 'universal-cookie';
import fetch from 'isomorphic-unfetch';
import type { BookDetails, Category, RemoteData, Chapter } from '../types';

const JWT_KEY = 'jwt';
const bookApiUrl = 'https://api.digitallibrary.io/book-api/v1';
const Cookie = () => new UniversalCookie();

export function getTokenFromLocalCookie() {
  return Cookie().get(JWT_KEY);
}

export async function fetchBook(
  id: string | number,
  language: string
): Promise<RemoteData<BookDetails>> {
  return await doFetch(`${bookApiUrl}/books/${language}/${id}`);
}

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

//todo: savebook

export async function saveBook(
  book: BookDetails
): Promise<RemoteData<BookDetails>> {
  const result = await doFetch(
    `${bookApiUrl}/books/${book.language.code}/${book.id}`,
    { method: 'PUT', body: JSON.stringify(book) }
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
