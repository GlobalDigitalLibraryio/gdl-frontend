// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import makeServiceWorkerEnv from 'service-worker-mock';
import makeFetchMock from 'service-worker-mock/fetch';
import {
  clientSupportsOffline,
  isBookAvailableOffline,
  getOfflineBooks
} from '../offline';

beforeEach(() => {
  Object.assign(global, makeFetchMock(), makeServiceWorkerEnv());
  jest.resetModules();
});

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

test('it can check offline support', () => {
  // Since the "browser" in this case is JSDom, it is false here
  expect(clientSupportsOffline()).toBeFalsy();
});

test('it returns empty list if no books are offlined', async () => {
  expect(await getOfflineBooks()).toEqual([]);
});

test('it returns false if the book is not offlined', async () => {
  expect(await isBookAvailableOffline(book)).toBeFalsy();
});
