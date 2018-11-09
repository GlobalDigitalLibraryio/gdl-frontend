// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import makeServiceWorkerEnv from 'service-worker-mock';
import makeFetchMock from 'service-worker-mock/fetch';
import offlineLibrary, { clientSupportsOffline } from '../offlineLibrary';

/* eslint no-restricted-globals: 1 */

beforeEach(() => {
  Object.assign(global, makeFetchMock(), makeServiceWorkerEnv());
  jest.resetModules();
});

// So Flow doesn't scream in every test
if (!offlineLibrary) throw new Error('Offline library not defined');

const CACHE_NAME = 'gdl-offline';

const book = {
  id: 123,
  bookFormat: 'HTML',
  title: '',
  description: '',
  chapters: [],
  downloads: {},
  language: {
    code: 'en',
    name: 'English'
  },
  contributors: [],
  readingLevel: '2',
  publisher: {
    name: ''
  },
  availableLanguages: [],
  supportsTranslation: false,
  uuid: '',
  category: 'library_books',
  license: {
    name: '',
    description: '',
    url: ''
  }
};

test('it can check if the client has offline support', () => {
  // Since the "browser" in this case is JSDom, it is false here
  expect(clientSupportsOffline()).toBeFalsy();
});

test('it returns empty list if no books are offlined', async () => {
  expect(await offlineLibrary.getBooks()).toEqual([]);
});

test('it can clear the offline library', async () => {
  // Othe cache to make sure it exists for the purpose of this test.
  await self.caches.open(CACHE_NAME);
  expect(self.snapshot().caches[CACHE_NAME]).toBeDefined();

  await offlineLibrary.clear();
  expect(self.snapshot().caches[CACHE_NAME]).toBeUndefined();
});

test('it returns false if the book is not offlined', async () => {
  expect(await offlineLibrary.getBook(book.id, book.language.code)).toBeFalsy();
});
