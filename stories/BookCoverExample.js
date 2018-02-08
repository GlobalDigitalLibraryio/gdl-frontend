// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import type { Book } from '../types';
import BookCardCover from '../components/BookCardCover';
import BookCover from '../components/BookCover';
import Container from '../components/Container';

/* eslint-disable jsx-a11y/href-no-hash */
// We use dummy links for example. So disable this rule

// FIXME: Have to add wrapping div around Card for now
// because of https://github.com/jxnblk/grid-styled/issues/44

const book: Book = {
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
  categories: [],
  contributors: [],
  readingLevel: '3',
  availableLanguages: [],
  publisher: {
    id: 1,
    name: 'Pratham Books'
  },
  coverPhoto: {
    large:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/v1/raw/2-smile-please-image_1.jpg',
    small:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/v1/raw/2-smile-please-image_1.jpg?width=200'
  },
  supportsTranslation: false,
  chapters: [],
  downloads: {
    epub: '',
    pdf: ''
  }
};

storiesOf('BookCover', module)
  .addDecorator(story => <Container mt={50}>{story()}</Container>)
  .add('Book card cover', () => <BookCardCover book={book} />)
  .add('Book cover', () => <BookCover coverPhoto={book.coverPhoto} />);
