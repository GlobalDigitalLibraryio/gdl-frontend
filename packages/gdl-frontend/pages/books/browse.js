// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { withRouter } from 'next/router';
import { Typography } from '@material-ui/core';

import withI18n from '../../hocs/withI18n';
import { fetchBooks } from '../../fetch';
import type { Book, Language, Category, Context, I18n } from '../../types';
import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import errorPage from '../../hocs/errorPage';
import Layout from '../../components/Layout';
import { Container, LoadingButton } from '../../elements/';
import Head from '../../components/Head';
import BookGrid from '../../components/BookGrid';
import { spacing } from '../../style/theme';

const PAGE_SIZE = 30;

type Props = {
  books: {
    results: Array<Book>,
    language: Language,
    page: number,
    totalCount: number
  },
  router: {
    query: {
      lang: string,
      readingLevel?: string,
      category?: string,
      sort?: string
    }
  },
  category: Category,
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
  static async getInitialProps({ query }: Context) {
    let category: Category;
    if (query.category === 'classroom_books') {
      category = 'classroom_books';
    } else {
      category = 'library_books'; // Default category
    }

    const booksRes = await fetchBooks(query.lang, {
      pageSize: PAGE_SIZE,
      level: query.readingLevel,
      category,
      sort: 'title'
    });

    if (!booksRes.isOk) {
      return {
        statusCode: booksRes.statusCode
      };
    }

    return {
      books: booksRes.data,
      category
    };
  }

  toFocus: ?HTMLAnchorElement;

  state = {
    books: this.props.books,
    isLoadingMore: false
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.books !== this.props.books) {
      this.setState({ books: nextProps.books });
    }
  }

  /**
   * Load more books when demanded
   */
  handleLoadMore = async () => {
    this.setState({ isLoadingMore: true });
    const { query } = this.props.router;

    const booksRes = await fetchBooks(query.lang, {
      level: query.readingLevel,
      page: this.state.books.page + 1,
      pageSize: PAGE_SIZE,
      category: this.props.category,
      sort: 'title'
    });

    // TODO: Notify user of error
    if (!booksRes.isOk) {
      return;
    }

    const books = booksRes.data;

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
    const { i18n, category } = this.props;
    const { readingLevel } = this.props.router.query;
    const { books } = this.state;

    const canLoadMore =
      this.state.books.totalCount > this.state.books.results.length;

    return (
      <Layout
        category={category}
        crumbs={[
          readingLevel ? (
            // $FlowFixMe This is the level from the query parameter. Which doesn't really typecheck
            <ReadingLevelTrans readingLevel={readingLevel} />
          ) : (
            <Trans>New arrivals</Trans>
          )
        ]}
      >
        <Head title={i18n.t`Browse books`} />
        <Container>
          <Typography
            variant="display2"
            align="center"
            css={{ marginBottom: spacing.large, marginTop: spacing.large }}
          >
            {books.results.length > 0 ? (
              readingLevel ? (
                // $FlowFixMe This is the level from the query parameter. Which doesn't really typecheck
                <ReadingLevelTrans readingLevel={readingLevel} />
              ) : (
                <Trans>New arrivals</Trans>
              )
            ) : (
              <Trans>No books found</Trans>
            )}
          </Typography>
          <BookGrid books={books.results} />
          <LoadingButton
            disabled={!canLoadMore}
            onClick={this.handleLoadMore}
            size="large"
            isLoading={this.state.isLoadingMore}
            color="primary"
            fullWidth
            css={{ marginTop: spacing.xlarge, marginBottom: spacing.medium }}
          >
            <Trans>See more books</Trans>
          </LoadingButton>
        </Container>
      </Layout>
    );
  }
}

export default errorPage(withRouter(withI18n(BrowsePage)));
