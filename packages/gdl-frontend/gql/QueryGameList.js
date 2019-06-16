// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import type { Category, OrderBy, ReadingLevel } from '../gqlTypes';

const GET_GAMES_QUERY = gql`
  query GameList($language: String!) {
    games(language: $language) {
      pageInfo {
        page
        pageSize
        pageCount
        hasPreviousPage
        hasNextPage
      }
      results {
        id
        title
        description
        url
        source
        publisher
        license
        language
        coverImage {
          url
          altText
        }
      }
    }
  }
`;

type Props = {
  language: string,
  children: any => React.Node
};

const QueryGameList = ({ language, children }: Props) => (
  <ApolloConsumer>
    {client => (
      <Query
        notifyOnNetworkStatusChange
        query={GET_GAMES_QUERY}
        ssr={false}
        variables={{
          language
        }}
      >
        {({ data, fetchMore, networkStatus }) => {
          const loading = networkStatus < 7;

          const loadMore = async () => {
            const { bookSummaries } = await client.readQuery({
              query: GET_GAMES_QUERY,
              variables: { category, language, orderBy, pageSize, readingLevel }
            });
            // Check if result is already in cache
            const shouldFetch =
              bookSummaries.results.length / 5 === bookSummaries.pageInfo.page;
            if (shouldFetch) {
              !loading &&
                (await fetchMore({
                  variables: {
                    category,
                    language,
                    page: data.bookSummaries.pageInfo.page + 1
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;

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
                }));
            } else {
              await client.writeQuery({
                query: GET_GAMES_QUERY,
                variables: {
                  category,
                  language,
                  orderBy,
                  pageSize,
                  readingLevel
                },
                data: {
                  bookSummaries: {
                    ...bookSummaries,
                    pageInfo: {
                      ...bookSummaries.pageInfo,
                      hasPreviousPage: true,
                      hasNextPage:
                        bookSummaries.pageInfo.page <
                        bookSummaries.pageInfo.pageCount - 1,
                      page: bookSummaries.pageInfo.page + 1
                    }
                  }
                }
              });
            }
          };

          const goBack = async () => {
            const { bookSummaries } = await client.readQuery({
              query: GET_GAMES_QUERY,
              variables: { category, language, orderBy, pageSize, readingLevel }
            });

            await client.writeQuery({
              query: GET_GAMES_QUERY,
              variables: {
                category,
                language,
                orderBy,
                pageSize,
                readingLevel
              },
              data: {
                bookSummaries: {
                  ...bookSummaries,
                  pageInfo: {
                    ...bookSummaries.pageInfo,
                    // There is always a prev page if you have navigated to page 2
                    hasPreviousPage: bookSummaries.pageInfo.page > 2,
                    hasNextPage: true,
                    page: bookSummaries.pageInfo.page - 1
                  }
                }
              }
            });
          };

          return children({
            loading,
            games: data.games,
            loadMore,
            goBack
          });
        }}
      </Query>
    )}
  </ApolloConsumer>
);

export default QueryGameList;
