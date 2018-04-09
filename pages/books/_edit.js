// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import doFetch, { fetchBook } from '../../fetch';
import type { BookDetails, Chapter, Context } from '../../types';
import securePage from '../../hocs/securePage';
import errorPage from '../../hocs/errorPage';
import Head from '../../components/Head';
import Editor from '../../components/Editor';

type Props = {
  book: BookDetails,
  chapter?: Chapter,
  url: {
    query: {
      id: string,
      lang: string,
      chapter?: string
    }
  }
};

class EditPage extends React.Component<Props> {
  static async getInitialProps({ query }: Context) {
    const bookRes = await fetchBook(query.id, query.lang);

    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }

    const book = bookRes.data;

    // Make sure the chapters are sorted by the chapter numbers
    // Cause further down we rely on the array indexes
    book.chapters.sort((a, b) => a.seqNo - b.seqNo);

    let chapter;
    if (query.chapter) {
      const chapterNum = parseInt(query.chapter, 10);

      const chapterRes = await doFetch(book.chapters[chapterNum].url);
      chapter = chapterRes.data;
    }

    return {
      book,
      chapter
    };
  }

  render() {
    let { book, chapter } = this.props;

    return (
      <React.Fragment>
        <Head
          title={`Editing ${book.title}`}
          image={book.coverPhoto ? book.coverPhoto.large : null}
        />
        <Editor book={book} chapter={chapter} />}
      </React.Fragment>
    );
  }
}

export default securePage(errorPage(EditPage));
