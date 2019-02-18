// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans, I18n } from '@lingui/react';
import { withRouter } from 'next/router';
import { Typography } from '@material-ui/core';

import { logEvent } from '../../lib/analytics';
import { fetchBooks } from '../../fetch';
import type {
  Book,
  Language,
  Category,
  Context,
  ReadingLevel
} from '../../types';
import { withErrorPage } from '../../hocs';
import Layout from '../../components/Layout';
import { Container, LoadingButton } from '../../elements/';
import Head from '../../components/Head';
import BookGrid from '../../components/BookGrid';
import GridContainer from '../../components/BookGrid/styledGridContainer';
import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import LevelHR from '../../components/Level/LevelHR';
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
      readingLevel?: ReadingLevel,
      category?: string,
      sort?: string
    }
  },
  category: Category
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
      books: booksRes.data
    };
  }

  toFocus: ?HTMLAnchorElement;

  state = {
    books: this.props.books,
    isLoadingMore: false
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.books !== this.props.books) {
      this.setState({ books: this.props.books });
    }
  }

  /**
   * Load more books when demanded
   */
  handleLoadMore = async () => {
    this.setState({ isLoadingMore: true });
    const { query } = this.props.router;
    logEvent('Navigation', 'More - Browse', query.readingLevel);

    const booksRes = await fetchBooks(query.lang, {
      level: query.readingLevel,
      page: this.state.books.page + 1,
      pageSize: PAGE_SIZE,
      category: this.props.category || this.props.router.query.category,
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
    const { readingLevel } = this.props.router.query;
    const { books } = this.state;

    const canLoadMore =
      this.state.books.totalCount > this.state.books.results.length;

    return (
      <Layout>
        <I18n>{({ i18n }) => <Head title={i18n.t`Browse books`} />}</I18n>
        <Container>
          <GridContainer>
            <Typography
              variant="h4"
              component="h1"
              align="left"
              css={{
                margin: `${spacing.large} 0`,
                width: 'auto',
                gridColumn: '1/-1'
              }}
            >
              {books.results.length > 0 ? (
                readingLevel ? (
                  <>
                    {/* $FlowFixMe This is the level from the query parameter. Which doesn't really typecheck */}
                    <ReadingLevelTrans readingLevel={readingLevel} />
                    <LevelHR
                      level={readingLevel}
                      css={{
                        margin: `${spacing.xsmall} 0`
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Trans>New arrivals</Trans>
                    <LevelHR
                      css={{
                        margin: `${spacing.xsmall} 0`
                      }}
                    />
                  </>
                )
              ) : (
                <Trans>No books found</Trans>
              )}
            </Typography>
          </GridContainer>
          <BookGrid books={books.results} />

          <div css={{ alignSelf: 'center' }}>
            <LoadingButton
              disabled={!canLoadMore}
              onClick={this.handleLoadMore}
              isLoading={this.state.isLoadingMore}
              color="primary"
              variant="outlined"
              css={{
                marginTop: spacing.xlarge,
                marginBottom: spacing.medium
              }}
            >
              <Trans>More books</Trans>
            </LoadingButton>
          </div>
        </Container>
      </Layout>
    );
  }
}

export default withErrorPage(withRouter(BrowsePage));
