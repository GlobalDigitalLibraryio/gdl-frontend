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
import type {
  Book,
  RemoteData,
  Language,
  Category,
  Context,
  I18n
} from '../../types';
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
      lang: string,
      readingLevel?: string,
      category?: string,
      sort?: string
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

class BrowsePage extends React.Component<Props, State> {
  static async getInitialProps({ query, accessToken }: Context) {
    let category: Category;
    if (query.category === 'library_books') {
      category = 'library_books';
    } else if (query.category === 'classroom_books') {
      category = 'classroom_books';
    }

    const books = await fetchBooks(query.lang, {
      pageSize: PAGE_SIZE,
      level: query.readingLevel,
      category
    })(accessToken);

    return {
      books
    };
  }

  toFocus: ?HTMLAnchorElement;

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
      level: query.readingLevel,
      page: this.state.books.page + 1,
      pageSize: PAGE_SIZE
    })();

    // Focus the first book of the extra books we're loading
    const toFocus = books.results[0];

    this.setState(
      state => ({
        isLoadingMore: false,
        books: {
          // Set the newly fetched results
          ...books,
          // But append the array to the books we already have
          results: state.books.results.concat(books.results)
        }
      }),
      () => {
        // Use a query selector to find the book we want to focus.
        const bookAnchor = document.querySelectorAll(
          `[href='/${toFocus.language.code}/books/details/${toFocus.id}']`
        )[1];
        bookAnchor && bookAnchor.focus();
      }
    );
  };

  render() {
    const { i18n } = this.props;
    const { readingLevel } = this.props.url.query;
    const { books } = this.state;

    const canLoadMore =
      this.state.books.totalCount > this.state.books.results.length;

    return (
      <Layout
        language={books.language}
        crumbs={[
          readingLevel ? i18n.t`Level ${readingLevel}` : i18n.t`New arrivals`
        ]}
      >
        <Head title={i18n.t`Browse books`} />

        <Container pt={20}>
          <H1 textAlign="center">
            {books.results.length > 0 ? (
              readingLevel ? (
                <Trans>Level {readingLevel}</Trans>
              ) : (
                <Trans>New arrivals</Trans>
              )
            ) : (
              <Trans>No books found</Trans>
            )}
          </H1>
          <Box my={30}>
            <BookGrid books={books.results} />
          </Box>
          <Box pt={6} pb={30} textAlign="center">
            <Button
              disabled={!canLoadMore}
              onClick={this.handleLoadMore}
              isLoading={this.state.isLoadingMore}
            >
              <Trans>See more books</Trans>
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
}

export default defaultPage(BrowsePage);
