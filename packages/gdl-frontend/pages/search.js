// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans, Plural } from '@lingui/react';
import { withRouter } from 'next/router';
import { Typography } from '@material-ui/core';

import type { Book, Context } from '../types';
import { Router } from '../routes';
import { SEARCH_PAGE_SIZE } from '../config';
import {
  SearchField,
  SearchHit,
  Placeholder,
  NoResults
} from '../components/Search';
import Layout, { Main } from '../components/Layout';
import { getBookLanguageCode } from '../lib/storage';
import Head from '../components/Head';
import { Container, LoadingButton } from '../elements';
import { spacing, colors } from '../style/theme';
import { TABLET_BREAKPOINT } from '../style/theme/misc';
import { search } from '../fetch';
import { errorPage } from '../hocs';

const QUERY_PARAM = 'q';
const LANG_PARAM = 'l';

type Props = {
  searchResult: ?{
    results: Array<Book>,
    page: number,
    totalCount: number
  },
  router: {
    query: {
      q?: string,
      l?: string
    },
    pathname: string,
    asPath: string
  }
};

type State = {
  searchResult: ?{
    results: Array<Book>,
    page: number,
    totalCount: number
  },
  searchQuery: string,
  lastSearchQuery?: string,
  isLoadingMore: boolean,
  languageCode: string
};

class SearchPage extends React.Component<Props, State> {
  static async getInitialProps({ query, req }: Context) {
    let searchResult;
    // FIXME: Hmm.... we can't do this because of caching right?
    // We get the language code either from the query params or the cookie

    if (query[QUERY_PARAM]) {
      const searchQuery = query[QUERY_PARAM];
      const languageCode = query[LANG_PARAM] || getBookLanguageCode(req);

      searchResult = await search(searchQuery, languageCode, {
        pageSize: SEARCH_PAGE_SIZE
      });

      if (!searchResult.isOk) {
        return {
          statusCode: searchResult.statusCode
        };
      }
    }

    return {
      searchResult:
        searchResult && searchResult.data ? searchResult.data : undefined
    };
  }

  state = {
    searchResult: this.props.searchResult,
    searchQuery: this.props.router.query[QUERY_PARAM] || '',
    lastSearchQuery: this.props.router.query[QUERY_PARAM],
    isLoadingMore: false,
    languageCode: this.props.router.query[LANG_PARAM] || getBookLanguageCode()
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.router.query.q !== prevProps.router.query.q) {
      window.location.reload();
    }
  }

  handleSearch = async event => {
    event.preventDefault();
    if (!this.state.searchQuery || this.state.searchQuery.trim() === '') {
      return;
    }

    // On mobile, blur the input field on submit to hide the virtual keyboard
    if (window.innerWidth < TABLET_BREAKPOINT) {
      const searchInput = document.querySelector('#booksearch');
      searchInput && searchInput.blur();
    }

    this.setState(state => ({ lastSearchQuery: state.searchQuery }));

    Router.pushRoute(
      'search',
      {
        [QUERY_PARAM]: this.state.searchQuery,
        // $FlowFixMe: We're already checking if language is defined
        [LANG_PARAM]: this.props.languageCode
      },
      { shallow: true }
    );

    const queryRes = await search(
      this.state.searchQuery,
      this.state.languageCode,
      {
        pageSize: SEARCH_PAGE_SIZE
      }
    );

    // TODO: Notify user of error
    if (!queryRes.isOk) {
      return;
    }

    this.setState({ searchResult: queryRes.data });
  };

  handleLoadMore = async () => {
    this.setState({ isLoadingMore: true });
    // Fixes flow warnings
    if (!this.state.searchResult) return;

    const queryRes = await search(
      this.state.searchQuery,
      this.state.languageCode,
      {
        pageSize: SEARCH_PAGE_SIZE,
        page: this.state.searchResult.page + 1
      }
    );

    // TODO: Notify user of error
    if (!queryRes.isOk) {
      return;
    }

    const searchResult = queryRes.data;

    // Focus the first book of the extra books we're loading
    const toFocus = searchResult.results[0];

    this.setState(
      state => ({
        isLoadingMore: false,
        searchResult: {
          // Set the newly fetched results
          ...searchResult,
          // But append the array to the books we already have
          // $FlowFixMe Should be okay, but doesn't type check
          results: state.searchResult.results.concat(searchResult.results)
        }
      }),
      () => {
        // Focus the second anchor found, the first is an anchor with an image that is hidden from screen readers
        const bookAnchor =
          toFocus &&
          document.querySelectorAll(
            `[href='/${toFocus.language.code}/books/details/${toFocus.id}']`
          )[1];
        bookAnchor && bookAnchor.focus();
      }
    );
  };

  handleQueryChange = event =>
    this.setState({ searchQuery: event.target.value });

  render() {
    const { searchResult, lastSearchQuery } = this.state;

    return (
      <Layout wrapWithMain={false}>
        <Head title="Search" />
        <Main>
          <Container my={spacing.medium}>
            {/* action attribute ensures mobile safari shows search button in keyboard. See https://stackoverflow.com/a/26287843*/}
            <form onSubmit={this.handleSearch} action=".">
              <SearchField
                autoFocus
                label="Search"
                id="booksearch"
                onChange={this.handleQueryChange}
                value={this.state.searchQuery}
                placeholder="Search"
              />
            </form>

            {/* 
              Important that the div with the aria-live is present when the search page first loads
              cause screen readers doesn't recognize that content has been added
            */}
            <div aria-live="polite" aria-atomic="true">
              {searchResult && (
                <Typography
                  component="h1"
                  align="center"
                  variant="subheading"
                  css={{ marginTop: spacing.medium }}
                >
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
                      No results for{' '}
                      <strong>&quot;{lastSearchQuery}&quot;</strong>
                    </Trans>
                  )}
                </Typography>
              )}
            </div>
          </Container>

          <Container
            mt={spacing.medium}
            py={spacing.medium}
            style={{
              background: colors.base.white,
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
                      <SearchHit key={book.id} book={book} />
                    ))}
                  </div>
                  <div css={{ alignSelf: 'center' }}>
                    <LoadingButton
                      variant="outlined"
                      color="primary"
                      disabled={
                        searchResult.results.length >= searchResult.totalCount
                      }
                      onClick={this.handleLoadMore}
                      isLoading={this.state.isLoadingMore}
                    >
                      <Trans>More books</Trans>
                    </LoadingButton>
                  </div>
                </Fragment>
              )
            ) : (
              <Placeholder />
            )}
          </Container>
        </Main>
      </Layout>
    );
  }
}

export default errorPage(withRouter(SearchPage));
