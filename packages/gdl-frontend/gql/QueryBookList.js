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

const GET_BOOKS_QUERY = gql`
  query BookList(
    $page: Int
    $language: String!
    $category: Category!
    $pageSize: Int
    $readingLevel: ReadingLevel
    $orderBy: OrderBy
  ) {
    bookSummaries(
      language: $language
      category: $category
      orderBy: $orderBy
      pageSize: $pageSize
      page: $page
      readingLevel: $readingLevel
    ) {
      pageInfo {
        page
        pageSize
        pageCount
        hasPreviousPage
        hasNextPage
      }
      results {
        id
        bookId
        title
        coverImage {
          url: urlV2
        }
        language {
          code
        }
      }
    }
  }
`;

type Props = {
  language: string,
  orderBy: OrderBy,
  pageSize: number,
  category: Category,
  readingLevel: ReadingLevel,
  children: any => React.Node
};

const QueryBookList = ({
  category,
  orderBy,
  pageSize,
  language,
  readingLevel,
  children
}: Props) => (
  <ApolloConsumer>
    {client => (
      <Query
        notifyOnNetworkStatusChange
        query={GET_BOOKS_QUERY}
        ssr={false}
        variables={{
          category,
          language,
          orderBy,
          pageSize,
          readingLevel
        }}
      >
        {({ data, fetchMore, networkStatus }) => {
          const loading = networkStatus < 7;

          const loadMore = async () => {
            const { bookSummaries } = await client.readQuery({
              query: GET_BOOKS_QUERY,
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
                query: GET_BOOKS_QUERY,
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
              query: GET_BOOKS_QUERY,
              variables: { category, language, orderBy, pageSize, readingLevel }
            });

            await client.writeQuery({
              query: GET_BOOKS_QUERY,
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

          const books = data.bookSummaries;

          return children({
            loading,
            books,
            loadMore,
            goBack
          });
        }}
      </Query>
    )}
  </ApolloConsumer>
);

export default QueryBookList;
