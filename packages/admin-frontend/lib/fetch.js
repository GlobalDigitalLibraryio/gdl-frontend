// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import fetch from 'isomorphic-unfetch';
import { getAuthToken } from 'gdl-auth';
import getConfig from 'next/config';
import type {
  BookDetails,
  Category,
  RemoteData,
  Chapter,
  Language,
  FeaturedContent,
  Book,
  ImageCropCoordinates,
  NewImageMetadata,
  ImageMetadata,
  License
} from '../types';

const {
  publicRuntimeConfig: { bookApiUrl, imageApiUrl }
} = getConfig();

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
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH',
    body?: any
  }
): Promise<RemoteData<any>> {
  const token = typeof window !== 'undefined' ? getAuthToken() : undefined;

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

export async function saveImageCropCoordinates(
  imageId: string,
  data: ImageCropCoordinates
): Promise<
  RemoteData<{
    ratio: string,
    revision: number,
    x: number,
    y: number,
    width: number,
    height: number
  }>
> {
  const result = await doFetch(`${imageApiUrl}/images/${imageId}/variants`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return result;
}

export async function fetchImageMetadata(
  imageId: string
): Promise<RemoteData<ImageMetadata>> {
  const result = await doFetch(`${imageApiUrl}/images/${imageId}`);
  return result;
}

export async function updateImageMetadata(
  imageMetadata: ImageMetadata
): Promise<RemoteData<void>> {
  const data = {
    id: imageMetadata.id,
    language: imageMetadata.alttext.language,
    alttext: imageMetadata.alttext.alttext,
    caption: imageMetadata.caption.caption,
    title: imageMetadata.title.title,
    copyright: imageMetadata.copyright,
    tags: imageMetadata.tags.tags
  };

  const result = await doFetch(`${imageApiUrl}/images/${data.id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });

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

export function fetchSources(
  languageCode: string
): Promise<RemoteData<Array<any>>> {
  return doFetch(`${bookApiUrl}/sources/${languageCode}`);
}

export function fetchFeaturedContent(
  language: ?string
): Promise<RemoteData<Array<FeaturedContent>>> {
  return doFetch(`${bookApiUrl}/featured/${language || ''}`);
}

export function saveFeaturedContent(
  featuredContent: FeaturedContent,
  languageCode: string
): Promise<RemoteData<{ id: number }>> {
  // transform the featured content object into the format that the API is accepting
  const transformedFeaturedContent = {
    ...featuredContent,
    language: languageCode
  };

  return doFetch(`${bookApiUrl}/featured`, {
    method: 'POST',
    body: JSON.stringify(transformedFeaturedContent)
  });
}

export function updateFeaturedContent(
  featuredContent: FeaturedContent
): Promise<RemoteData<{ id: number }>> {
  return doFetch(`${bookApiUrl}/featured`, {
    method: 'PUT',
    body: JSON.stringify(featuredContent)
  });
}

export function deleteFeaturedContent(
  id: number
): Promise<
  RemoteData<{ code: string, description: string, occuredAt: string }>
> {
  return doFetch(`${bookApiUrl}/featured/${id}`, {
    method: 'DELETE'
  });
}

type Options = {
  pageSize?: number,
  level?: string,
  category?: Category,
  sort?: 'arrivaldate' | '-arrivaldate' | 'id' | '-id' | 'title' | '-title',
  page?: number
};

export async function search(
  query: string,
  options: Options = {}
): Promise<
  RemoteData<{|
    page: number,
    totalCount: number,
    results: Array<Book>
  |}>
> {
  const result = await doFetch(
    `${bookApiUrl}/search?query=${encodeURIComponent(
      query
    )}&page-size=${options.pageSize || 10}&page=${options.page || 1}`
  );

  if (result.isOk) {
    result.data.results = result.data.results.map(bookCategoryMapper);
  }

  return result;
}

export async function uploadNewImage(
  file: File,
  metadata: NewImageMetadata
): Promise<RemoteData<ImageMetadata>> {
  const url = `${imageApiUrl}/images`;

  const formData = new FormData();
  formData.append('metadata', JSON.stringify(metadata));
  formData.append('file', file);

  const result = await doFetch(url, {
    method: 'POST',
    body: formData
  });
  return result;
}

export async function fetchLicenses(): Promise<RemoteData<Array<License>>> {
  const url = `${imageApiUrl}/images/licenses`;

  return await doFetch(url, {
    method: 'GET',
    body: null
  });
}
