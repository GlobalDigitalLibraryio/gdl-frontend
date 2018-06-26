// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import UniversalCookie from 'universal-cookie';
import fetch from 'isomorphic-unfetch';
import type {
  BookDetails,
  Category,
  RemoteData,
  Chapter,
  Language,
  FeaturedContent,
  Book
} from '../types';
import { bookApiUrl } from '../config';

const JWT_KEY = 'jwt';
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

export async function exportBooks(
  language: string,
  source: string
): Promise<RemoteData<Blob>> {
  return await doFetch(`${bookApiUrl}/export/${language}/${source}`);
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
    method: 'POST' | 'GET' | 'PUT' | 'DELETE',
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

export async function fetchChapter(
  bookId: string | number,
  chapterId: string | number,
  language: string
): Promise<RemoteData<Chapter>> {
  const result = await doFetch(
    `${bookApiUrl}/books/${language}/${bookId}/chapters/${chapterId}`
  );

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

export async function fetchFlaggedBooks(
  pageSize: number,
  page: number
): Promise<
  RemoteData<{
    results: Array<Book>,
    totalCount: number,
    page: number,
    pageSize: number
  }>
> {
  const result = await doFetch(
    `${bookApiUrl}/books/flagged/?page-size=${pageSize}&page=${page}`
  );

  return result;
}

export function fetchLanguages(): Promise<RemoteData<Array<Language>>> {
  return doFetch(`${bookApiUrl}/languages`);
}

export function fetchFeaturedContent(
  language: ?string
): Promise<RemoteData<Array<FeaturedContent>>> {
  return doFetch(`${bookApiUrl}/featured/${language || ''}`);
}

export function saveFeaturedContent(
  featuredContent: FeaturedContent,
  languageCode: string
): Promise<RemoteData<{}>> {
  // transform the featured content object into the format that the API is accepting
  const transformedFeaturedContent = {
    description: featuredContent.description,
    language: languageCode,
    link: featuredContent.link,
    title: featuredContent.title,
    imageUrl: featuredContent.imageUrl
  };

  return doFetch(`${bookApiUrl}/featured`, {
    method: 'POST',
    body: JSON.stringify(transformedFeaturedContent)
  });
}

export function updateFeaturedContent(
  featuredContent: FeaturedContent
): Promise<RemoteData<{}>> {
  return doFetch(`${bookApiUrl}/featured`, {
    method: 'PUT',
    body: JSON.stringify(featuredContent)
  });
}

export function deleteFeaturedContent(id: number): Promise<RemoteData<{}>> {
  return doFetch(`${bookApiUrl}/featured/${id}`, {
    method: 'DELETE',
    body: JSON.stringify(id)
  });
}
