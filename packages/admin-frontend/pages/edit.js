// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import type { BookDetails, Chapter, Context } from '../types';
import { fetchBook, fetchChapter } from '../lib/fetch';
import Editor from '../components/Editor';

type Props = {
  book: BookDetails,
  chapter?: Chapter
};

export default class EditPage extends React.Component<Props> {
  static async getInitialProps({ query }: Context) {
    const bookRes = await fetchBook(query.id, query.lang);
    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }
    const book = bookRes.data;

    let chapter;
    if (query.chapterId) {
      const chapterRes = await fetchChapter(
        query.id,
        query.chapterId,
        query.lang
      );

      if (!chapterRes.isOk) {
        return {
          statusCode: chapterRes.statusCode
        };
      }
      chapter = chapterRes.data;
    }

    return { book, chapter };
  }

  render() {
    const { book, chapter } = this.props;

    return <Editor book={book} chapter={chapter} />;
  }
}
