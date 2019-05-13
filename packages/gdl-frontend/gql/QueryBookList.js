// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import type { Category, OrderBy } from '../gqlTypes';

const GET_BOOKS = gql`
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
          url
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
  children: any => React.Node
};

const QueryBookList = ({
  category,
  orderBy,
  pageSize,
  language,
  children
}: Props) => (
  <Query
    query={GET_BOOKS}
    ssr={false}
    variables={{
      category,
      language,
      orderBy,
      pageSize
    }}
  >
    {({ data, fetchMore }) => {
      const loadMore = () =>
        fetchMore({
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
        });

      const books = data.bookSummaries;

      return children({ books, loadMore });
    }}
  </Query>
);

export default QueryBookList;
