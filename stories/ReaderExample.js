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
import Reader from '../components/Reader';

const book: Book = {
  id: 28,
  revision: 1,
  externalId: '31',
  uuid: '0ee71a23-8c86-4453-b062-4a1a4e2659f9',
  title: 'Indlu kaMpukwana',
  description: 'Indlu kaMpukwana',
  language: { code: 'xho', name: 'Xhosa' },
  availableLanguages: [{ code: 'xho', name: 'Xhosa' }],
  license: {
    id: 2,
    revision: 1,
    name: 'cc-by-sa-4.0',
    description: 'Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  publisher: { id: 2, revision: 1, name: 'Bookdash' },
  readingLevel: '2',
  typicalAgeRange: '4-7',
  educationalUse: 'reading',
  educationalRole: 'learner',
  timeRequired: 'PT10M',
  datePublished: '2017-10-05',
  dateCreated: '2017-10-05',
  dateArrived: '2017-10-05',
  categories: [
    { id: 1, revision: 1, name: 'Animals' },
    { id: 2, revision: 1, name: 'Running' },
  ],
  coverPhoto: {
    large:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/raw/28-cover.jpg',
    small:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/image-api/raw/28-cover.jpg?width=200',
  },
  downloads: {
    epub:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/book-api/download/epub/xho/0ee71a23-8c86-4453-b062-4a1a4e2659f9.epub',
    pdf:
      'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/book-api/download/pdf/xho/0ee71a23-8c86-4453-b062-4a1a4e2659f9.pdf',
  },
  tags: [],
  contributors: [
    {
      id: 60,
      revision: 1,
      type: 'Author',
      name: 'Michele Fry, Amy Uzzell, Jennifer Jacobs',
    },
  ],
  chapters: [
    {
      id: 641,
      seqNo: 1,
      url:
        'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/book-api/v1/books/xho/28/chapters/641',
    },
    {
      id: 642,
      seqNo: 2,
      url:
        'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/book-api/v1/books/xho/28/chapters/642',
    },
    {
      id: 643,
      seqNo: 3,
      url:
        'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/book-api/v1/books/xho/28/chapters/643',
    },
  ],
};

storiesOf('Reader', module).add('Reader', () => (
  <Reader book={book} onClose={() => console.log('Close requested')} />
));
