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

const GET_GAMES_QUERY = gql`
  query GameList($language: String!, $pageSize: Int, $page: Int) {
    games(language: $language, pageSize: $pageSize, page: $page) {
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
            const { games } = await client.readQuery({
              query: GET_GAMES_QUERY,
              variables: { language, pageSize }
            });

            // Check if result is already in cache
            const shouldFetch =
              games.results.length / 5 === games.pageInfo.page;
            if (shouldFetch) {
              !loading &&
                (await fetchMore({
                  variables: {
                    language,
                    page: data.games.pageInfo.page + 1
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;

                    return Object.assign({}, prev, {
                      games: {
                        ...prev.games,
                        pageInfo: fetchMoreResult.games.pageInfo,
                        results: [
                          ...prev.games.results,
                          ...fetchMoreResult.games.results
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
                  games: {
                    ...games,
                    pageInfo: {
                      ...games.pageInfo,
                      hasPreviousPage: true,
                      hasNextPage:
                        games.pageInfo.page < games.pageInfo.pageCount - 1,
                      page: games.pageInfo.page + 1
                    }
                  }
                }
              });
            }
          };

          const goBack = async () => {
            const { games } = await client.readQuery({
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
                games: {
                  ...games,
                  pageInfo: {
                    ...games.pageInfo,
                    // There is always a prev page if you have navigated to page 2
                    hasPreviousPage: games.pageInfo.page > 2,
                    hasNextPage: true,
                    page: games.pageInfo.page - 1
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
