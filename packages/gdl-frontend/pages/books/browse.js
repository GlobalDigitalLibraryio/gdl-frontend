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
import type { Book, Language, Category, Context, I18n } from '../../types';
import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import defaultPage from '../../hocs/defaultPage';
import errorPage from '../../hocs/errorPage';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Text from '../../elements/Text';
import Container from '../../elements/Container';
import Head from '../../components/Head';
import BookGrid from '../../components/BookGrid';
import { spacing, fonts } from '../../style/theme';

const PAGE_SIZE = 30;

type Props = {
  books: {
    results: Array<Book>,
    language: Language,
    page: number,
    totalCount: number
  },
  url: {
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
    const { query } = this.props.url;

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
    const { readingLevel } = this.props.url.query;
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
          <Text accessibilityRole="heading" {...headerStyle}>
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
          </Text>
          <BookGrid books={books.results} />
          {/* Should really be View instead of Text here.. but */}
          <Text my={spacing.xlarge} textAlign="center">
            <Button
              disabled={!canLoadMore}
              onClick={this.handleLoadMore}
              isLoading={this.state.isLoadingMore}
            >
              <Trans>See more books</Trans>
            </Button>
          </Text>
        </Container>
      </Layout>
    );
  }
}

const headerStyle = {
  textAlign: 'center',
  my: spacing.medium,
  fontWeight: fonts.weight.medium
};

export default defaultPage(errorPage(BrowsePage));
