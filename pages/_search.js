// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans, Plural } from '@lingui/react';
import styled from 'react-emotion';

import type { Book, RemoteData, Context } from '../types';
import { Router } from '../routes';
import { SEARCH_PAGE_SIZE } from '../config';
import {
  SearchField,
  SearchHit,
  Placeholder,
  NoResults
} from '../components/Search';
import Layout from '../components/Layout';
import Head from '../components/Head';
import Button from '../components/Button';
import Container from '../components/Container';
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
  lastSearchQuery?: string,
  isLoadingMore: boolean
};

const ResultsMeta = styled('h1')`
  text-align: center;
  margin-top: 15px;
  font-size: 1rem;
  font-weight: normal;
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
    lastSearchQuery: this.props.url.query[QUERY_PARAM],
    isLoadingMore: false
  };

  handleSearch = async event => {
    event.preventDefault();
    this.setState(state => ({ lastSearchQuery: state.searchQuery }));

    Router.pushRoute(
      'search',
      {
        lang: this.props.url.query.lang,
        [QUERY_PARAM]: this.state.searchQuery
      },
      { shallow: true }
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
    const { searchResult, lastSearchQuery } = this.state;
    return (
      <Layout crumbs={[<Trans>Search</Trans>]}>
        <Head title="Search" />
        <Container pt={[15, 20]}>
          {/* action attribute ensures mobile safari shows search button in keyboard. See https://stackoverflow.com/a/26287843*/}
          <form onSubmit={this.handleSearch} action=".">
            <SearchField
              autoFocus
              label="Search"
              id="booksearch"
              onChange={this.handleQueryChange}
              value={this.state.searchQuery}
              placeholder="Search"
              required
            />
          </form>

          {searchResult && (
            <ResultsMeta aria-live="polite">
              {searchResult.results.length > 0 ? (
                <Fragment>
                  <Plural
                    value={searchResult.totalCount}
                    one="# result for"
                    other="# results for"
                  />{' '}
                  <strong>&quot;{lastSearchQuery}&quot;</strong>
                </Fragment>
              ) : (
                <Trans>
                  No results for <strong>&quot;{lastSearchQuery}&quot;</strong>
                </Trans>
              )}
            </ResultsMeta>
          )}
        </Container>

        <Container
          mt={[15, 20]}
          py={[15, 30]}
          style={{
            background: '#fff',
            minHeight: '-webkit-fill-available',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)'
          }}
        >
          {searchResult ? (
            searchResult.results.length === 0 ? (
              <NoResults />
            ) : (
              <Fragment>
                <div>
                  {searchResult.results.map(book => (
                    <SearchHit
                      key={book.id}
                      book={book}
                      route={b => `/${b.language.code}/books/${b.id}`}
                    />
                  ))}
                </div>
                <Box textAlign="center">
                  <Button
                    disabled={
                      searchResult.results.length >= searchResult.totalCount
                    }
                    onClick={this.handeLoadMore}
                    isLoading={this.state.isLoadingMore}
                  >
                    <Trans>See more</Trans>
                  </Button>
                </Box>
              </Fragment>
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
