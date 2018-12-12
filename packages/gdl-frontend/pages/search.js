// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans, Plural } from '@lingui/react';
import { withRouter } from 'next/router';
import { Typography } from '@material-ui/core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import type { Context } from '../types';
import type { Search } from '../gqlTypes';

import { logEvent } from '../lib/analytics';
import { SearchHit, Placeholder, NoResults } from '../components/Search';
import Layout from '../components/Layout';
import Head from '../components/Head';
import { Container, LoadingButton } from '../elements';
import { spacing } from '../style/theme';
import { withErrorPage } from '../hocs';

const QUERY_PARAM = 'q';
const SEARCH_PAGE_SIZE = 10;

type Props = {
  router: {
    query: {
      q?: string
    }
  }
};

class SearchPage extends React.Component<Props> {
  static async getInitialProps({ query, apolloClient }: Context) {
    if (query[QUERY_PARAM]) {
      await apolloClient.query({
        query: SEARCH_QUERY,
        variables: {
          query: query[QUERY_PARAM],
          page: 1,
          pageSize: SEARCH_PAGE_SIZE
        }
      });
    }
    return {};
  }

  handleFetchMore = (currentPage: number, fetchMore) => {
    logEvent('Navigation', 'More - Search', this.props.router.query.q);

    fetchMore({
      variables: {
        page: currentPage + 1
      },
      updateQuery: (
        prev: Search,
        { fetchMoreResult }: { fetchMoreResult: Search }
      ) => {
        if (!fetchMoreResult) return prev;
        // Focus the first book of the extra books we're loading
        const toFocus = fetchMoreResult.search.results[0];
        // Use a query selector to find the book we want to focus.
        const bookAnchor = document.querySelectorAll(
          `[href='/${toFocus.language.code}/books/details/${toFocus.bookId}']`
        )[1];
        bookAnchor && bookAnchor.focus();

        return Object.assign({}, prev, {
          search: {
            ...prev.search,
            pageInfo: fetchMoreResult.search.pageInfo,
            results: [...prev.search.results, ...fetchMoreResult.search.results]
          }
        });
      }
    });
  };

  render() {
    const query = this.props.router.query[QUERY_PARAM];

    return (
      <>
        <Head title="Search" />
        <Layout containerBackground="white">
          <Query
            query={SEARCH_QUERY}
            skip={!query}
            variables={{
              query,
              page: 1,
              pageSize: SEARCH_PAGE_SIZE
            }}
          >
            {({
              loading,
              error,
              data,
              fetchMore
            }: {
              loading: boolean,
              data: Search,
              error: any,
              fetchMore: ({}) => void
            }) => {
              if (!data && !error) {
                return <Placeholder />;
              }

              const {
                search: { pageInfo, results, totalCount }
              } = data;

              return (
                <>
                  <Container my={spacing.large}>
                    {/*
                    Important that the div with the aria-live is present when the search page first loads
                    cause screen readers doesn't recognize that content has been added
                    */}
                    <div aria-live="polite" aria-atomic="true">
                      <Typography
                        component="h1"
                        align="center"
                        variant="subtitle1"
                      >
                        {totalCount > 0 ? (
                          <>
                            <Plural
                              value={totalCount}
                              one="# result for"
                              other="# results for"
                            />{' '}
                            <strong>
                              &quot;
                              {query}
                              &quot;
                            </strong>
                          </>
                        ) : (
                          <Trans>
                            No results for{' '}
                            <strong>
                              &quot;
                              {query}
                              &quot;
                            </strong>
                          </Trans>
                        )}
                      </Typography>
                    </div>
                  </Container>

                  <Container pb={spacing.large}>
                    {totalCount === 0 ? (
                      <NoResults />
                    ) : (
                      <>
                        <div>
                          {results.map(book => (
                            <SearchHit key={book.id} book={book} />
                          ))}
                        </div>
                        <div css={{ alignSelf: 'center' }}>
                          <LoadingButton
                            variant="outlined"
                            color="primary"
                            disabled={!pageInfo.hasNextPage}
                            onClick={() =>
                              this.handleFetchMore(pageInfo.page, fetchMore)
                            }
                            isLoading={loading}
                          >
                            <Trans>More books</Trans>
                          </LoadingButton>
                        </div>
                      </>
                    )}
                  </Container>
                </>
              );
            }}
          </Query>
        </Layout>
      </>
    );
  }
}

const SEARCH_QUERY = gql`
  query Search($query: String!, $pageSize: Int, $page: Int!) {
    search(query: $query, pageSize: $pageSize, page: $page) {
      results {
        id
        bookId
        title
        highlightTitle
        description
        highlightDescription
        readingLevel
        coverImage {
          url
        }
        language {
          code
          name
        }
      }
      totalCount
      pageInfo {
        page
        hasNextPage
      }
    }
  }
`;

export default withErrorPage(withRouter(SearchPage));
