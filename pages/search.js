// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans, Plural } from '@lingui/react';

import type { Book, Context, Language } from '../types';
import { Router } from '../routes';
import { SEARCH_PAGE_SIZE } from '../config';
import {
  SearchField,
  SearchHit,
  Placeholder,
  NoResults
} from '../components/Search';
import Layout, { Main } from '../components/Layout';
import { Breadcrumb, NavContextBar } from '../components/NavContextBar';
import { SelectLanguage } from '../components/LanguageMenu';
import {
  setBookLanguage,
  getBookLanguageCode,
  getBookLanguage
} from '../lib/storage';
import Head from '../components/Head';
import Button from '../components/Button';
import { Container, Text } from '../elements';
import { spacing, colors } from '../style/theme';
import { search } from '../fetch';
import defaultPage from '../hocs/defaultPage';
import errorPage from '../hocs/errorPage';

const QUERY_PARAM = 'q';
const LANG_PARAM = 'l';

type Props = {
  searchResult: ?{
    results: Array<Book>,
    page: number,
    totalCount: number,
    language: Language
  },
  languages: Array<Language>,
  languageCode: string,
  url: {
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
  language: ?Language
};

const resultsTextStyle = {
  textAlign: 'center',
  fontSize: '1rem',
  fontWeight: 'normal',
  mt: spacing.medium
};

class SearchPage extends React.Component<Props, State> {
  static async getInitialProps({ query, req }: Context) {
    let searchResult;

    if (query[QUERY_PARAM]) {
      const searchQuery = query[QUERY_PARAM];

      // We get the language code either from the query params or the cookie
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
    searchQuery: this.props.url.query[QUERY_PARAM] || '',
    lastSearchQuery: this.props.url.query[QUERY_PARAM],
    isLoadingMore: false,
    language: this.props.searchResult ? this.props.searchResult.language : null
  };

  /**
   * We only want to render the language menu on the client side.
   * So we don't fill the cache with all the search pages with the only change in the HTML being the shown language name
   */
  componentDidMount() {
    const language =
      (this.props.searchResult && this.props.searchResult.language) ||
      getBookLanguage();

    this.setState({ language });
  }

  handleSearch = async event => {
    event.preventDefault();
    if (
      !this.state.searchQuery ||
      this.state.searchQuery.trim() === '' ||
      !this.state.language
    ) {
      return;
    }

    this.setState(state => ({ lastSearchQuery: state.searchQuery }));

    Router.pushRoute(
      'search',
      {
        [QUERY_PARAM]: this.state.searchQuery,
        // $FlowFixMe: We're already checking if language is defined
        [LANG_PARAM]: this.state.language.code
      },
      { shallow: true }
    );

    const queryRes = await search(
      this.state.searchQuery,
      // $FlowFixMe: We're already checking if language is defined
      this.state.language.code,
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

  handleChangeLanguage = language => {
    this.setState({ language });
    setBookLanguage(language);
  };

  handleLoadMore = async () => {
    this.setState({ isLoadingMore: true });
    // Fixes flow warnings
    if (!this.state.searchResult || !this.state.language) return;

    const queryRes = await search(
      this.state.searchQuery,
      this.state.language.code,
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
        const bookAnchor = document.querySelectorAll(
          `[href='/${toFocus.language.code}/books/details/${toFocus.id}']`
        )[1];
        bookAnchor && bookAnchor.focus();
      }
    );
  };

  handleQueryChange = event =>
    this.setState({ searchQuery: event.target.value });

  render() {
    const { searchResult, lastSearchQuery, language } = this.state;

    return (
      <Layout wrapWithMain={false}>
        <Head title="Search" />
        <NavContextBar>
          <Breadcrumb crumbs={[<Trans>Search</Trans>]} />
          {language && (
            <SelectLanguage
              language={language}
              onSelectLanguage={this.handleChangeLanguage}
            />
          )}
        </NavContextBar>
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

            {searchResult && (
              <Text
                {...resultsTextStyle}
                aria-live="polite"
                accessibilityRole="heading"
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
              </Text>
            )}
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
                  {/* Should really be View instead of Text here.. but */}
                  <Text textAlign="center">
                    <Button
                      disabled={
                        searchResult.results.length >= searchResult.totalCount
                      }
                      onClick={this.handleLoadMore}
                      isLoading={this.state.isLoadingMore}
                    >
                      <Trans>See more</Trans>
                    </Button>
                  </Text>
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

export default defaultPage(errorPage(SearchPage));
