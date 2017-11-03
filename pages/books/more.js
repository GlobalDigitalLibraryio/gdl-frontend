// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import { fetchBooks } from '../../fetch';
import type { Book, RemoteData } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import Navbar from '../../components/Navbar';
import H1 from '../../components/H1';
import Container from '../../components/Container';
import Meta from '../../components/Meta';
import BookGrid from '../../components/BookGrid';

type Props = {
  books: RemoteData<{
    results: Array<Book>,
  }>,
  level: ?string,
};

class BookPage extends React.Component<Props> {
  static async getInitialProps({ query }) {
    const books = await fetchBooks(query.lang, {
      pageSize: 25,
      level: query.level,
    });

    return {
      books,
      level: query.level,
    };
  }

  render() {
    const { books, level } = this.props;

    return (
      <div>
        <Meta
          title={level ? `Level ${level} books` : 'New arrivals'}
          description="More books"
        />
        <Navbar />

        <Container pt={20}>
          {books.results.length > 0 ? (
            <H1>
              {level ? (
                <Trans>Level {level}</Trans>
              ) : (
                <Trans>New arrivals</Trans>
              )}
            </H1>
          ) : (
            <H1 textAlign="center">
              <Trans>No books found</Trans>
            </H1>
          )}
          <BookGrid books={books.results} />
        </Container>
      </div>
    );
  }
}

export default defaultPage(BookPage);
