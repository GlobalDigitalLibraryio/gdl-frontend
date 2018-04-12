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
import Layout from '../components/Layout';
import Head from '../components/Head';
import Button from '../components/Button';
import Container from '../elements/Container';
import Text from '../elements/Text';
import { search, fetchLanguages } from '../fetch';
import defaultPage from '../hocs/defaultPage';
import errorPage from '../hocs/errorPage';
import { LanguageCategory } from '../components/LanguageCategoryContext';
import { getBookLanguageFromCookie } from '../lib/cookie';
import { DEFAULT_LANGUAGE_CODE } from '../config';
import { spacing, colors } from '../style/theme';
import LanguageMenu from '../components/TranslationLanguageMenu';

const QUERY_PARAM = 'q';
const LANG_PARAM = 'l';

type Props = {
  searchResult: ?{
    results: Array<Book>,
    page: number,
    totalCount: number
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
  isLoadingMore: boolean
};

const resultsTextStyle = {
  textAlign: 'center',
  fontSize: '1rem',
  fontWeight: 'normal',
  mt: spacing.medium
};

class SearchPage extends React.Component<Props, State> {
  static async getInitialProps({ query, req }: Context) {
    // We get the language code either from the query params, or the cookies or the default value
    const languageCode =
      query[LANG_PARAM] ||
      getBookLanguageFromCookie(req) ||
      DEFAULT_LANGUAGE_CODE;

    let searchResult;

    if (query[QUERY_PARAM]) {
      const searchQuery = query[QUERY_PARAM];
      searchResult = await search(searchQuery, languageCode, {
        pageSize: SEARCH_PAGE_SIZE
      });

      if (!searchResult.isOk) {
        return {
          statusCode: searchResult.statusCode
        };
      }
    }

    const languagesRes = await fetchLanguages();
    if (!languagesRes.isOk) {
      return {
        statusCode: languagesRes.statusCode
      };
    }

    return {
      languageCode,
      languages: languagesRes.data,
      searchResult:
        searchResult && searchResult.data ? searchResult.data : undefined
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
    if (!this.state.searchQuery || this.state.searchQuery.trim() === '') return;

    this.setState(state => ({ lastSearchQuery: state.searchQuery }));

    Router.pushRoute(
      'search',
      {
        [QUERY_PARAM]: this.state.searchQuery,
        [LANG_PARAM]: this.props.languageCode
      },
      { shallow: true }
    );

    const queryRes = await search(
      this.state.searchQuery,
      this.props.languageCode,
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
      this.props.languageCode,
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
    const { searchResult, lastSearchQuery } = this.state;
    const { languageCode } = this.props;

    return (
      <LanguageCategory category={undefined} languageCode={languageCode}>
        <Layout
          crumbs={[<Trans>Search</Trans>]}
          languages={this.props.languages}
        >
          <Head title="Search" />
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
        </Layout>
      </LanguageCategory>
    );
  }
}

export default defaultPage(errorPage(SearchPage));
