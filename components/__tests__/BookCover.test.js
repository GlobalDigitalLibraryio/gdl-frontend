// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';
import type { Book } from '../../types';
import { theme } from '../../hocs/withTheme';
import BookCover from '../BookCover';

const book: Book = {
  id: 1,
  title: 'A Life in the Fair Jungle',
  description:
    'Sindi buzzes with colorful songs and dance. Will starting school end all that?',
  license: {
    id: 1,
    name: 'cc by 4.0',
    description: 'Attribution 4.0 International (CC BY 4.0)',
    url: 'https://creativecommons.org/licenses/by/4.0/',
  },
  language: {
    code: 'eng',
    name: 'English',
  },
  categories: [],
  contributors: [],
  readingLevel: '3',
  availableLanguages: [],
  publisher: {
    id: 1,
    name: 'Pratham Books',
  },
  coverPhoto: {
    large:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/v1/raw/2-smile-please-image_1.jpg',
    small:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/v1/raw/2-smile-please-image_1.jpg?width=200',
  },
  chapters: [],
  downloads: {
    epub: '',
    pdf: '',
  },
};

test('Renders', () => {
  const tree = mount(<BookCover book={book} theme={theme} />);

  expect(toJson(tree)).toMatchSnapshot();
});
