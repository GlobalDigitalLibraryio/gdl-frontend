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

export const GET_GAMES_QUERY = gql`
  query GameList($language: String!, $pageSize: Int, $page: Int) {
    games_v2(language: $language, pageSize: $pageSize, page: $page) {
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
  pageSize: number,
  children: any => React.Node
};

const QueryGameList = ({ language, children, pageSize }: Props) => (
  <ApolloConsumer>
    {client => (
      <Query
        notifyOnNetworkStatusChange
        query={GET_GAMES_QUERY}
        ssr={false}
        variables={{
          language,
          pageSize
        }}
      >
        {({ data, fetchMore, networkStatus }) => {
          const loading = networkStatus < 7;

          const loadMore = async () => {
            const { games_v2 } = await client.readQuery({
              query: GET_GAMES_QUERY,
              variables: { language, pageSize }
            });

            // Check if result is already in cache
            const shouldFetch =
              games_v2.results.length / 5 === games_v2.pageInfo.page;
            if (shouldFetch) {
              !loading &&
                (await fetchMore({
                  variables: {
                    language,
                    page: data.games_v2.pageInfo.page + 1
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;

                    return Object.assign({}, prev, {
                      games_v2: {
                        ...prev.games_v2,
                        pageInfo: fetchMoreResult.games_v2.pageInfo,
                        results: [
                          ...prev.games_v2.results,
                          ...fetchMoreResult.games_v2.results
                        ]
                      }
                    });
                  }
                }));
            } else {
              await client.writeQuery({
                query: GET_GAMES_QUERY,
                variables: {
                  language,
                  pageSize
                },
                data: {
                  games_v2: {
                    ...games_v2,
                    pageInfo: {
                      ...games_v2.pageInfo,
                      hasPreviousPage: true,
                      hasNextPage:
                        games_v2.pageInfo.page <
                        games_v2.pageInfo.pageCount - 1,
                      page: games_v2.pageInfo.page + 1
                    }
                  }
                }
              });
            }
          };

          const goBack = async () => {
            const { games_v2 } = await client.readQuery({
              query: GET_GAMES_QUERY,
              variables: { language, pageSize }
            });

            await client.writeQuery({
              query: GET_GAMES_QUERY,
              variables: {
                language,
                pageSize
              },
              data: {
                games_v2: {
                  ...games_v2,
                  pageInfo: {
                    ...games_v2.pageInfo,
                    // There is always a prev page if you have navigated to page 2
                    hasPreviousPage: games_v2.pageInfo.page > 2,
                    hasNextPage: true,
                    page: games_v2.pageInfo.page - 1
                  }
                }
              }
            });
          };

          return children({
            loading,
            games: data.games_v2,
            loadMore,
            goBack
          });
        }}
      </Query>
    )}
  </ApolloConsumer>
);

export default QueryGameList;
