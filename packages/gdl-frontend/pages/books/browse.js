// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'next/router';
import { Typography } from '@material-ui/core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { logEvent } from '../../lib/analytics';
import type { Context } from '../../types';
import type { intlShape } from 'react-intl';

import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import { withErrorPage } from '../../hocs';
import Layout from '../../components/Layout';
import { Container, LoadingButton } from '../../elements/';
import Head from '../../components/Head';
import BookGrid from '../../components/BookGrid';
import LevelHR from '../../components/Level/LevelHR';
import { spacing } from '../../style/theme';
import GridContainer from '../../components/BookGrid/styledGridContainer';

import type { BrowseBooks, Category, ReadingLevel } from '../../gqlTypes';

const PAGE_SIZE = 30;
const INITIAL_PAGE_NUMBER = 1;

const QUERY = gql`
  query BrowseBooks(
    $language: String!
    $readingLevel: ReadingLevel
    $category: Category
    $orderBy: OrderBy
    $pageSize: Int
    $page: Int!
  ) {
    bookSummaries(
      language: $language
      pageSize: $pageSize
      category: $category
      readingLevel: $readingLevel
      orderBy: $orderBy
      page: $page
    ) {
      results {
        id
        bookId
        title
        coverImage {
          url
        }
        language {
          code
        }
      }
      pageInfo {
        page
        hasNextPage
      }
    }
  }
`;

type Props = {
  category: Category,
  router: {
    query: {
      lang: string,
      readingLevel?: ReadingLevel,
      category?: Category,
      sort?: string
    }
  },
  intl: intlShape
};

class BrowsePage extends React.Component<Props> {
  static async getInitialProps({ query, apolloClient }: Context) {
    let category: Category = 'Library'; // Default category
    if (query.category === 'Classroom') {
      category = 'Classroom';
    }

    await apolloClient.query({
      query: QUERY,
      variables: {
        page: INITIAL_PAGE_NUMBER,
        category,
        language: query.lang,
        orderBy: 'title_ASC',
        pageSize: PAGE_SIZE,
        readingLevel: query.readingLevel
      }
    });

    return {
      category
    };
  }

  /**
   * Load more books when demanded
   */
  handleFetchMore = (currentPage: number, fetchMore) => {
    const {
      router: { query }
    } = this.props;
    logEvent('Navigation', 'More - Browse', query.readingLevel);

    fetchMore({
      variables: {
        page: currentPage + 1
      },
      updateQuery: (
        prev: BrowseBooks,
        { fetchMoreResult }: { fetchMoreResult: BrowseBooks }
      ) => {
        if (!fetchMoreResult) return prev;
        // Focus the first book of the extra books we're loading
        const toFocus = fetchMoreResult.bookSummaries.results[0];
        // Use a query selector to find the book we want to focus.
        const bookAnchor = document.querySelectorAll(
          `[href='/${toFocus.language.code}/books/details/${toFocus.bookId}']`
        )[1];
        bookAnchor && bookAnchor.focus();

        return Object.assign({}, prev, {
          bookSummaries: {
            ...prev.bookSummaries,
            pageInfo: fetchMoreResult.bookSummaries.pageInfo,
            results: [
              ...prev.bookSummaries.results,
              ...fetchMoreResult.bookSummaries.results
            ]
          }
        });
      }
    });
  };

  render() {
    const {
      router: { query },
      category,
      intl
    } = this.props;

    return (
      <Query
        query={QUERY}
        variables={{
          page: INITIAL_PAGE_NUMBER,
          category,
          language: query.lang,
          orderBy: 'title_ASC',
          pageSize: PAGE_SIZE,
          readingLevel: query.readingLevel
        }}
      >
        {({
          loading,
          error,
          data,
          fetchMore
        }: {
          data: BrowseBooks,
          loading: boolean,
          error: any,
          fetchMore: ({}) => void
        }) => {
          const {
            bookSummaries: { pageInfo, results }
          } = data;

          return (
            <Layout>
              <Head
                title={intl.formatMessage({
                  id: 'Browse books',
                  defaultMessage: 'Browse books'
                })}
              />
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
                    {results.length > 0 ? (
                      query.readingLevel ? (
                        <>
                          {/* $FlowFixMe This is the level from the query parameter. Which doesn't really typecheck */}
                          <ReadingLevelTrans
                            readingLevel={query.readingLevel}
                          />
                          <LevelHR
                            level={query.readingLevel}
                            css={{
                              margin: `${spacing.xsmall} 0`
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <FormattedMessage
                            id="New arrivals"
                            defaultMessage="New arrivals"
                          />
                          <LevelHR
                            css={{
                              margin: `${spacing.xsmall} 0`
                            }}
                          />
                        </>
                      )
                    ) : (
                      <FormattedMessage
                        id="No books found"
                        defaultMessage="No books found"
                      />
                    )}
                  </Typography>
                </GridContainer>
                <BookGrid books={results} />
                <div css={{ alignSelf: 'center' }}>
                  <LoadingButton
                    disabled={!pageInfo.hasNextPage}
                    onClick={() =>
                      this.handleFetchMore(pageInfo.page, fetchMore)
                    }
                    isLoading={loading}
                    color="primary"
                    variant="outlined"
                    css={{
                      marginTop: spacing.xlarge,
                      marginBottom: spacing.medium
                    }}
                  >
                    <FormattedMessage
                      id="More books"
                      defaultMessage="More books"
                    />
                  </LoadingButton>
                </div>
              </Container>
            </Layout>
          );
        }}
      </Query>
    );
  }
}

export default withErrorPage(withRouter(injectIntl(BrowsePage)));
