// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { fetchBooks } from '../../fetch';
import { Link } from '../../routes';
import type { Book, RemoteData, Language, Context, I18n } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Box from '../../components/Box';
import H1 from '../../components/H1';
import Container from '../../components/Container';
import Head from '../../components/Head';
import BookGrid from '../../components/BookGrid';

const PAGE_SIZE = 30;

type Props = {
  books: RemoteData<{
    results: Array<Book>,
    language: Language,
    page: number,
    totalCount: number
  }>,
  url: {
    query: {
      level?: string,
      lang: string
    }
  },
  i18n: I18n
};

type State = {
  books: {
    results: Array<Book>,
    language: Language,
    page: number,
    totalCount: number
  },
  isLoadingMore: boolean
};

class BookPage extends React.Component<Props, State> {
  static async getInitialProps({ query, accessToken }: Context) {
    const books = await fetchBooks(query.lang, {
      pageSize: PAGE_SIZE,
      level: query.level
    })(accessToken);

    return {
      books
    };
  }

  state = {
    books: this.props.books,
    isLoadingMore: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.books !== this.props.books) {
      this.setState({ books: nextProps.books });
    }
  }

  /**
   * Load more books when demanded
   */
  handleLoadMore = async () => {
    this.setState({ isLoadingMore: true });
    const { query } = this.props.url;

    const books = await fetchBooks(query.lang, {
      level: query.level,
      page: this.state.books.page + 1,
      pageSize: PAGE_SIZE
    })();

    this.setState(state => ({
      isLoadingMore: false,
      books: {
        // Set the newly fetched results
        ...books,
        // But append the array to the books we already have
        results: state.books.results.concat(books.results)
      }
    }));
  };

  render() {
    const { i18n } = this.props;
    const { level } = this.props.url.query;
    const { books } = this.state;

    // The route to book differs based on "where we come from". This is because of breadcrumbs
    const route = level
      ? (book: Book) => `/${book.language.code}/books/level${level}/${book.id}`
      : (book: Book) => `/${book.language.code}/books/new/${book.id}`;

    const canLoadMore =
      this.state.books.totalCount > this.state.books.results.length;

    return (
      <Layout
        language={books.language}
        crumbs={[
          <Link route="books" params={{ lang: books.language.code }}>
            <a>{books.language.name}</a>
          </Link>,
          level ? i18n.t`Level ${level}` : i18n.t`New arrivals`
        ]}
      >
        <Head
          title={
            level
              ? i18n.t`Browse level ${level} books`
              : i18n.t`Browse new arrivals`
          }
        />

        <Container pt={20}>
          <H1 textAlign="center">
            {/* eslint-disable no-nested-ternary */}
            {books.results.length > 0 ? (
              level ? (
                <Trans>Level {level}</Trans>
              ) : (
                <Trans>New arrivals</Trans>
              )
            ) : (
              <Trans>No books found</Trans>
            )}
          </H1>
          <BookGrid books={books.results} mt={30} route={route} />
          <Box pt={6} pb={30} textAlign="center">
            <Button
              aria-live="polite"
              disabled={!canLoadMore}
              onClick={this.handleLoadMore}
              isLoading={this.state.isLoadingMore}
            >
              {this.state.isLoadingMore ? (
                <Trans>Loading books</Trans>
              ) : (
                <Trans>Load more books</Trans>
              )}
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
}

export default defaultPage(BookPage);
