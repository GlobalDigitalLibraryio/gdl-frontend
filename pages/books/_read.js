// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import { fetchBook, fetchChapter } from '../../fetch';
import { hasClaim, claims } from '../../lib/auth/token';
import type { BookDetails, Chapter, Context } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import errorPage from '../../hocs/errorPage';
import Head from '../../components/Head';
import Reader from '../../components/Reader';

type Props = {
  book: BookDetails,
  chapter: Chapter,
  userHasEditAccess: boolean,
  url: {
    query: {
      id: string,
      chapterId?: string
    }
  }
};

class Read extends React.Component<Props> {
  static async getInitialProps({ query, req }: Context) {
    const bookRes = await fetchBook(query.id, query.lang);

    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }

    const book = bookRes.data;

    // If no chapter is specified, we get the first one
    const chapterId = query.chapterId ? query.chapterId : book.chapters[0].id;

    const chapterRes = await fetchChapter(query.id, chapterId, query.lang);

    if (!chapterRes.isOk) {
      return {
        statusCode: chapterRes.statusCode
      };
    }

    return {
      userHasEditAccess: hasClaim(claims.writeBook, req),
      chapter: chapterRes.data,
      book
    };
  }

  render() {
    let { book, chapter, userHasEditAccess } = this.props;

    return (
      <React.Fragment>
        <Head
          title={`Read: ${book.title}`}
          description={book.description}
          image={book.coverPhoto ? book.coverPhoto.large : null}
        />

        <Reader
          book={book}
          chapter={chapter}
          userHasEditAccess={userHasEditAccess}
        />
      </React.Fragment>
    );
  }
}

export default defaultPage(errorPage(Read));
