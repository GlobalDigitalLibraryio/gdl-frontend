// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { shallow } from 'enzyme';
import nock from 'nock';
import Router from 'next/router';
import type { BookDetails, Chapter } from '../../../types';
import Reader from '../';

// Mock out the router. See https://github.com/zeit/next.js/issues/1827#issuecomment-323314141
const mockedRouter = {
  push: () => Promise.resolve(),
  replace: () => Promise.resolve()
};
Router.router = mockedRouter;

const book: BookDetails = {
  uuid: 'abc123',
  id: 1,
  title: 'A Life in the Fair Jungle',
  description:
    'Sindi buzzes with colorful songs and dance. Will starting school end all that?',
  license: {
    id: 1,
    name: 'cc by 4.0',
    description: 'Attribution 4.0 International (CC BY 4.0)',
    url: 'https://creativecommons.org/licenses/by/4.0/'
  },
  language: {
    code: 'eng',
    name: 'English'
  },
  category: 'library_books',
  contributors: [],
  readingLevel: '3',
  availableLanguages: [],
  publisher: {
    id: 1,
    name: 'Pratham Books'
  },
  supportsTranslation: false,
  coverPhoto: {
    large:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/v1/raw/2-smile-please-image_1.jpg',
    small:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/v1/raw/2-smile-please-image_1.jpg?width=200'
  },
  bookFormat: 'HTML',
  chapters: [
    { id: 128, seqNo: 1 },
    { id: 129, seqNo: 2 },
    { id: 130, seqNo: 3 },
    { id: 131, seqNo: 4 }
  ],
  downloads: {
    epub: '',
    pdf: ''
  }
};

const chapter: Chapter = { id: 128, seqNo: 1, content: '</br>' };

beforeAll(() => {
  nock('http://www.example.no')
    .persist()
    .get('/chapter')
    .reply(200, { seqNo: 1, content: '<p>Chapter</p>' });
});

test('Sets the initial chapter', () => {
  const tree = shallow(<Reader book={book} chapter={chapter} />);
  expect(tree.state().chapterPointer).toEqual(book.chapters[0]);
});

test('Loads the following chapter when going forward', () => {
  const tree = shallow(<Reader book={book} chapter={chapter} />);
  const loadChapterMock = jest.fn();
  tree.instance().loadChapter = loadChapterMock;
  tree.update();

  tree.instance().handleRequestNextChapter();
  expect(tree.instance().loadChapter).toBeCalledWith(130);
});

test('Loads the preceding chapter when going back', () => {
  const chapter: Chapter = { id: 131, seqNo: 4, content: '</br>' };
  const tree = shallow(<Reader book={book} chapter={chapter} />);
  const loadChapterMock = jest.fn();
  tree.instance().loadChapter = loadChapterMock;
  tree.update();

  tree.instance().handleRequestPreviousChapter();
  expect(tree.instance().loadChapter).toBeCalledWith(129);
});
