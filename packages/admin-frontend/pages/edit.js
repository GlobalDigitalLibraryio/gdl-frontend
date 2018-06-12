// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import type { BookDetails, Chapter, Context } from '../types';
import { fetchBook } from '../lib/fetch';
import Editor from '../components/Editor';

type Props = {
  book: BookDetails,
  chapter?: Chapter
};

//accepts urls on this format http://localhost:3000/edit?id=1223&lang=en

export default class EditPage extends React.Component<Props> {
  static async getInitialProps({ query }: Context) {
    console.log('url parameters');
    console.log(query.id);
    console.log(query.lang);

    const bookRes = await fetchBook(query.id, query.lang);

    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }

    const book = bookRes.data;

    return { book };
  }

  render() {
    let { book } = this.props;

    return <Editor book={book} />;
  }
}
/*
const book = {
  id: 21,
  revision: 1,
  externalId: '26',
  uuid: 'ecc84a9e-7276-4f18-99c0-e7b6e755068f',
  title: 'Aaloo-Maaloo-Kaaloo',
  description:
    "Three day Maloo had to get some potates from his grandmother's kitchen garden, but he could not find any. And then Kaloo helps him to uncover the hidden potatoes!!!!",
  language: { code: 'en', name: 'English' },
  availableLanguages: [
    { code: 'en', name: 'English' },
    { code: 'am', name: 'አማርኛ' }
  ],
  license: {
    id: 1,
    revision: 1,
    name: 'cc-by-4.0',
    description: 'Attribution 4.0 International (CC BY 4.0)',
    url: 'https://creativecommons.org/licenses/by/4.0/'
  },
  publisher: { id: 1, revision: 1, name: 'Pratham books' },
  readingLevel: '1',
  typicalAgeRange: '4-7',
  educationalUse: 'reading',
  educationalRole: 'learner',
  timeRequired: 'PT10M',
  datePublished: '2017-11-09',
  dateCreated: '2017-11-09',
  dateArrived: '2017-11-09',
  categories: [{ id: 1, revision: 1, name: 'library_books' }],
  coverImage: {
    url: 'https://images.test.digitallibrary.io/9UY4oeLN.jpg',
    alttext: ''
  },
  downloads: {
    epub:
      'https://books.test.digitallibrary.io/epub/en/ecc84a9e-7276-4f18-99c0-e7b6e755068f.epub',
    pdf:
      'https://books.test.digitallibrary.io/pdf/en/ecc84a9e-7276-4f18-99c0-e7b6e755068f.pdf'
  },
  tags: [],
  contributors: [{ id: 25, revision: 1, type: 'Author', name: '' }],
  chapters: [
    {
      id: 345,
      seqNo: 1,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/345'
    },
    {
      id: 346,
      seqNo: 2,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/346'
    },
    {
      id: 349,
      seqNo: 5,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/349'
    },
    {
      id: 350,
      seqNo: 6,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/350'
    },
    {
      id: 351,
      seqNo: 7,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/351'
    },
    {
      id: 352,
      seqNo: 8,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/352'
    },
    {
      id: 353,
      seqNo: 9,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/353'
    },
    {
      id: 354,
      seqNo: 10,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/354'
    },
    {
      id: 348,
      seqNo: 4,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/348'
    },
    {
      id: 347,
      seqNo: 3,
      url:
        'https://api.test.digitallibrary.io/book-api/v1/books/en/21/chapters/347'
    }
  ],
  supportsTranslation: true,
  bookFormat: 'HTML',
  pageOrientation: 'LANDSCAPE',
  source: 'storyweaver',
  publishingStatus: 'PUBLISHED'
};

*/
