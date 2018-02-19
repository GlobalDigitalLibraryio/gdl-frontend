// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import Router from 'next/router';
import styled from 'react-emotion';

import type { Book, RemoteData, Context } from '../types';
import { SEARCH_PAGE_SIZE } from '../config';
import { SearchHit, Placeholder, NoResults } from '../components/Search';
import Layout from '../components/Layout';
import Head from '../components/Head';
import Button from '../components/Button';
import Container from '../components/Container';
import TextField from '../components/TextField';
import Box from '../components/Box';
import { search } from '../fetch';
import defaultPage from '../hocs/defaultPage';

const QUERY_PARAM = 'q';

type Props = {
  searchResult: ?RemoteData<{
    results: Array<Book>,
    page: number,
    totalCount: number
  }>,
  url: {
    query: {
      lang: string,
      q?: string
    },
    pathname: string,
    asPath: string
  }
};

type State = {
  searchResult: ?RemoteData<{
    results: Array<Book>,
    page: number,
    totalCount: number
  }>,
  searchQuery: string,
  isLoadingMore: boolean
};

const ResultsMeta = styled('span')`
  text-align: center;
  display: block;
  margin-top: 15px;
`;

class SearchPage extends React.Component<Props, State> {
  static async getInitialProps({ query, accessToken }: Context) {
    let searchResult;
    if (query[QUERY_PARAM]) {
      const searchQuery = query[QUERY_PARAM];
      searchResult = await search(searchQuery, query.lang, {
        pageSize: SEARCH_PAGE_SIZE
      })(accessToken);
    }
    return {
      searchResult
    };
  }
  state = {
    searchResult: this.props.searchResult,
    searchQuery: this.props.url.query[QUERY_PARAM] || '',
    isLoadingMore: false
  };

  handleSearch = async event => {
    event.preventDefault();

    Router.push(
      {
        pathname: this.props.url.pathname
      },
      `/${this.props.url.query.lang}/search?${QUERY_PARAM}=${
        this.state.searchQuery
      }`
    );
    const results = await search(
      this.state.searchQuery,
      this.props.url.query.lang,
      {
        pageSize: SEARCH_PAGE_SIZE
      }
    )();
    this.setState({ searchResult: results });
  };

  handeLoadMore = async () => {
    this.setState({ isLoadingMore: true });
    // Fixes flow warnings
    if (!this.state.searchResult) return;

    const searchResult = await search(
      this.state.searchQuery,
      this.props.url.query.lang,
      {
        pageSize: SEARCH_PAGE_SIZE,
        page: this.state.searchResult.page + 1
      }
    )();

    this.setState(state => ({
      isLoadingMore: false,
      searchResult: {
        // Set the newly fetched results
        ...searchResult,
        // But append the array to the books we already have
        // $FlowFixMe Should be okay, but doesn't type check
        results: state.searchResult.results.concat(searchResult.results)
      }
    }));
  };
  handleQueryChange = event =>
    this.setState({ searchQuery: event.target.value });

  render() {
    const { searchResult } = this.state;
    return (
      <Layout crumbs={[<Trans>Search</Trans>]}>
        <Head title="Search" />
        <Container pt={[15, 20]}>
          <form onSubmit={this.handleSearch}>
            <TextField
              autoFocus
              label="Search"
              id="booksearch"
              type="search"
              onChange={this.handleQueryChange}
              value={this.state.searchQuery}
              placeholder="Search"
              required
            />
          </form>

          {searchResult && (
            <ResultsMeta>
              {searchResult.results.length > 0 ? (
                <Trans>
                  {searchResult.totalCount} results for{' '}
                  <strong>{this.props.url.query.q}</strong>
                </Trans>
              ) : (
                <Trans>
                  No results for <strong>{this.props.url.query.q}</strong>
                </Trans>
              )}
            </ResultsMeta>
          )}
        </Container>

        <Container mt={[15, 20]} pt={[15, 20]} style={{ background: '#fff' }}>
          {// eslint-disable-next-line no-nested-ternary
          searchResult ? (
            searchResult.results.length === 0 ? (
              <NoResults />
            ) : (
              <React.Fragment>
                {searchResult.results.map(book => (
                  <SearchHit
                    key={book.id}
                    book={book}
                    route={b => `/${b.language.code}/books/${b.id}`}
                  />
                ))}
                <Box pt={6} pb={30} textAlign="center">
                  <Button
                    aria-live="polite"
                    disabled={
                      searchResult.results.length >= searchResult.totalCount
                    }
                    onClick={this.handeLoadMore}
                    isLoading={this.state.isLoadingMore}
                  >
                    {this.state.isLoadingMore ? (
                      <Trans>Loading books</Trans>
                    ) : (
                      <Trans>Load more books</Trans>
                    )}
                  </Button>
                </Box>
              </React.Fragment>
            )
          ) : (
            <Placeholder />
          )}
        </Container>
      </Layout>
    );
  }
}

export default defaultPage(SearchPage);
