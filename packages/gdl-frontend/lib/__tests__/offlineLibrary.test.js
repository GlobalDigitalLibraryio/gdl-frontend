// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import makeServiceWorkerEnv from 'service-worker-mock';
import makeFetchMock from 'service-worker-mock/fetch';
import { OfflineLibrary, TimestampModel } from '../offlineLibrary';

/* eslint no-restricted-globals: 1 */

let offlineLibrary;
beforeEach(() => {
  Object.assign(global, makeFetchMock(), makeServiceWorkerEnv());
  offlineLibrary = new OfflineLibrary();
  jest.resetModules();
});

afterEach(() => offlineLibrary.clear());

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

test('it can add and retrieve a book from the library', async () => {
  await offlineLibrary.addBook(book);
  const fromLib = await offlineLibrary.getBook(book.id, book.language.code);
  expect(fromLib).toEqual(book);
});

test('it returns undefined if the book isnt in the library', async () => {
  expect(await offlineLibrary.getBook('no-such', 'book')).toBeUndefined();
});

test('it can delete a book from the library', async () => {
  await offlineLibrary.addBook(book);

  await offlineLibrary.deleteBook(book.id, book.language.code);

  expect(
    await offlineLibrary.getBook(book.id, book.language.code)
  ).toBeUndefined();
});

test('it returns the offline library', async () => {
  expect(await offlineLibrary.getBooks()).toEqual([]);

  const book1 = { ...book, id: 123 };
  const book2 = { ...book, id: 456 };

  await offlineLibrary.addBook(book1);
  await offlineLibrary.addBook(book2);

  expect(await offlineLibrary.getBooks()).toEqual([book1, book2]);
});

test('it can clear the offline library', async () => {
  await offlineLibrary.addBook(book);

  // Othe cache to make sure it exists for the purpose of this test.
  await self.caches.open(CACHE_NAME);
  expect(self.snapshot().caches[CACHE_NAME]).toBeDefined();

  await offlineLibrary.clear();
  expect(self.snapshot().caches[CACHE_NAME]).toBeUndefined();
  expect(await offlineLibrary.getBooks()).toEqual([]);
});

test('it removes the book when we try to get an expired one', async () => {
  await offlineLibrary.addBook(book);

  await setExpirationTimestamp(book, new Date(314159265359).getTime());

  expect(
    await offlineLibrary.getBook(book.id, book.language.code)
  ).toBeUndefined();
});

test('it removes expired books', async () => {
  expect(await offlineLibrary.getBooks()).toEqual([]);

  const book1 = { ...book, id: 123 };
  const book2 = { ...book, id: 456 };

  await offlineLibrary.addBook(book1);
  await offlineLibrary.addBook(book2);

  await setExpirationTimestamp(book1, new Date(314159265359).getTime());

  expect(await offlineLibrary.getBooks()).toEqual([book2]);

  expect(
    await offlineLibrary.getBook(book.id, book.language.code)
  ).toBeUndefined();
});

async function setExpirationTimestamp(book, timestamp: number) {
  const timestampModel = new TimestampModel();
  await timestampModel.timestampStore.setItem(
    `${book.id}-${book.language.code}`,
    timestamp
  );
}
