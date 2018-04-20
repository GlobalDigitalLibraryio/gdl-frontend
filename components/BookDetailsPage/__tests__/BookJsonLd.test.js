// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { createSerializer } from 'jest-emotion';
import * as emotion from 'emotion';
import { ContributorTypes, type BookDetails } from '../../../types';
import BookJsonLd from '../BookJsonLd';

expect.addSnapshotSerializer(createSerializer(emotion));
const bookBase: BookDetails = {
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
  bookFormat: 'HTML',
  chapters: [],
  downloads: {
    epub: '',
    pdf: ''
  }
};

test('Without coverImage and contributors', () => {
  const tree = shallow(<BookJsonLd book={bookBase} />);

  expect(toJson(tree)).toMatchSnapshot();
});

test('With coverImage', () => {
  // $FlowFixMe allow assignment
  const book = {
    ...bookBase,
    coverImage: {
      url:
        'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/v1/raw/2-smile-please-image_1.jpg',
      alttext: 'Some alt text'
    }
  };

  const tree = shallow(<BookJsonLd book={book} />);

  expect(toJson(tree)).toMatchSnapshot();
});

test('With contributors', () => {
  const book = {
    ...bookBase,
    contributors: [
      { id: 1, type: ContributorTypes.ILLUSTRATOR, name: 'Mrs. Drawer' },
      { id: 2, type: ContributorTypes.ILLUSTRATOR, name: 'Son of Mrs. Drawer' },
      { id: 3, type: ContributorTypes.AUTHOR, name: 'Ms Writer' }
    ]
  };

  const tree = shallow(<BookJsonLd book={book} />);

  expect(toJson(tree)).toMatchSnapshot();
});
