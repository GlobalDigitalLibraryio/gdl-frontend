// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { fetchBook } from '../../fetch';
import type { Book, RemoteData } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import { Router } from '../../routes';
import Meta from '../../components/Meta';
import Reader from '../../components/Reader';

type Props = {
  book: RemoteData<Book>,
};

class Read extends React.Component<Props> {
  static async getInitialProps({ query }) {
    const book = await fetchBook(query.id, query.lang);

    // Make sure the chapters are sorted by the chapter numbers
    // Cause further down we rely on the array indexes
    book.chapters.sort((a, b) => a.seqNo - b.seqNo);

    return {
      book,
    };
  }

  render() {
    const { book } = this.props;

    return (
      <div>
        <Meta
          title={book.title}
          description={book.description}
          image={book.coverPhoto ? book.coverPhoto.large : null}
        />

        <Reader
          book={book}
          chapter={this.props.url.query.chapter}
          onClose={() =>
            Router.pushRoute(
              'book',
              {
                id: book.id,
                lang: book.language.code,
              },
              { shallow: true },
            )}
        />
      </div>
    );
  }
}

export default defaultPage(Read);
