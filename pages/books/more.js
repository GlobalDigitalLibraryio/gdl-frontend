// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import { MdSync } from 'react-icons/lib/md';
import styled from 'styled-components';
import { fetchBooks } from '../../fetch';
import type { Book, RemoteData, Language } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import media from '../../components/helpers/media';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import H1 from '../../components/H1';
import Container from '../../components/Container';
import Meta from '../../components/Meta';
import BookGrid from '../../components/BookGrid';
import rotate360 from '../../components/helpers/rotate360';
import theme from '../../style/theme';

const PAGE_SIZE = 30;

type Props = {
  books: RemoteData<{
    results: Array<Book>,
    language: Language,
    page: number,
    totalCount: number,
  }>,
  url: {
    query: {
      level?: string,
      lang: string,
    },
  },
};

type State = {
  books: {
    results: Array<Book>,
    language: Language,
    page: number,
    totalCount: number,
  },
  isLoadingMore: boolean,
};

const MoreButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.link};
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 12px;
  ${media.tablet`
    font-size: 14px;
  `};
  &[disabled] {
    cursor: not-allowed;
    color: ${theme.grays.silverSand};
  }
`;

class BookPage extends React.Component<Props, State> {
  static async getInitialProps({ query }) {
    const books = await fetchBooks(query.lang, {
      pageSize: PAGE_SIZE,
      level: query.level,
    });

    return {
      books,
    };
  }

  state = {
    books: this.props.books,
    isLoadingMore: false,
  };

  /**
   * Load more books when demanded
   */
  handleLoadMore = async () => {
    // If it isn't possible to fetch more books. Bail out
    if (this.state.books.totalCount === this.state.books.results.length) {
      return;
    }

    this.setState({ isLoadingMore: true });
    const { query } = this.props.url;

    const books = await fetchBooks(query.lang, {
      level: query.level,
      page: this.state.books.page + 1,
      pageSize: PAGE_SIZE,
    });

    this.setState(state => ({
      isLoadingMore: false,
      books: {
        // Set the newly fetched results
        ...books,
        // But append the array to the books vi we already have
        results: state.books.results.concat(books.results),
      },
    }));
  };

  canLoadMore = () =>
    this.state.books.totalCount > this.state.books.results.length;

  render() {
    const { level } = this.props.url.query;
    const { books } = this.state;

    // The route to book differs based on "where we come from". This is because of breadcrumbs
    const route = level
      ? (book: Book) => `/${book.language.code}/books/level${level}/${book.id}`
      : (book: Book) => `/${book.language.code}/books/new/${book.id}`;

    return (
      <Layout
        currentPage={level ? `Level ${level}` : 'New arrivals'}
        language={books.language}
      >
        <Meta
          title={level ? `Level ${level} books` : 'New arrivals'}
          description="More books"
        />

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
          <BookGrid books={books.results} route={route} />
          <Box pt={6} pb={30} textAlign="center">
            {this.state.isLoadingMore ? (
              <MdSync
                style={{ animation: `${rotate360} 2s linear infinite` }}
              />
            ) : (
              <MoreButton
                disabled={!this.canLoadMore()}
                onClick={this.handleLoadMore}
                type="button"
              >
                <Trans>Load more books</Trans>
              </MoreButton>
            )}
          </Box>
        </Container>
      </Layout>
    );
  }
}

export default defaultPage(BookPage);
