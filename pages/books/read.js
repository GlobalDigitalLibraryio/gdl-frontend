// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { fetchBook } from '../../fetch';
import type { Book, RemoteData, Context } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import Head from '../../components/Head';
import Reader from '../../components/Reader';

type Props = {
  book: RemoteData<Book>,
  url: {
    query: {
      chapter?: string
    }
  }
};

class Read extends React.Component<Props> {
  static async getInitialProps({ query }: Context) {
    const book = await fetchBook(query.id, query.lang);

    // Make sure the chapters are sorted by the chapter numbers
    // Cause further down we rely on the array indexes
    book.chapters.sort((a, b) => a.seqNo - b.seqNo);

    return {
      book
    };
  }

  render() {
    const { book, url } = this.props;

    return (
      <React.Fragment>
        <Head
          title={book.title}
          isBookType
          description={book.description}
          imageUrl={book.coverPhoto ? book.coverPhoto.large : null}
        />

        <Reader book={book} initialChapter={url.query.chapter} />
      </React.Fragment>
    );
  }
}

export default defaultPage(Read);
