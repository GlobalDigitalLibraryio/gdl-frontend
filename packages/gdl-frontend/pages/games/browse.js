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
import LevelHR from '../../components/Level/LevelHR';
import { spacing } from '../../style/theme';
import GridContainer from '../../components/BookGrid/styledGridContainer';
import GameLink from '../../components/BookListSection/GameLink';

import queryString from 'query-string';

import type { BrowseGames, Category, ReadingLevel } from '../../gqlTypes';

const PAGE_SIZE = 30;
const INITIAL_PAGE_NUMBER = 1;

const BROWSE_GAMES_QUERY = gql`
  query BrowseGames($language: String!, $pageSize: Int, $page: Int) {
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
  category: Category,
  readingLevel: ReadingLevel,
  router: {
    query: {
      lang: string,
      category?: Category,
      sort?: string
    }
  },
  intl: intlShape
};

/**
 * After graphql migration, there is indication that some users still does request with
 * old readinglevel format, so we need to handle both old and new format.
 * It is not simple to convert it to old format, because the values of readinglevel
 * consist of both numberinc and string values which raise issues when using
 * a numeric value as key property both here and in our graphql service.
 * @param {readinglevel} level
 */
const parseReadingLevel = (level: string) => {
  switch (level) {
    case 'decodable':
      return 'Decodable';
    case '1':
      return 'Level1';
    case '2':
      return 'Level2';
    case '3':
      return 'Level3';
    case '4':
      return 'Level4';
    case 'read-aloud':
      return 'ReadAloud';
    default:
      return level;
  }
};

class BrowsePage extends React.Component<Props> {
  static async getInitialProps({ query, asPath, apolloClient, req }: Context) {
    try {
      // Checks if client it is a client request, which happen if you direct access on url
      const queryFromPath = queryString.parse(
        req && req.url ? req.url.split(/\?/)[1] : asPath.split(/\?/)[1]
      );

      const parsedLevel = parseReadingLevel(queryFromPath.readingLevel);

      await apolloClient.query({
        query: BROWSE_GAMES_QUERY,
        variables: {
          page: INITIAL_PAGE_NUMBER,
          language: query.lang,
          pageSize: PAGE_SIZE
        }
      });

      return {
        readingLevel: parsedLevel
      };
    } catch (error) {
      /*
       * If user request invalid query param to graphql you trigger bad input validation
       * and receive 400: Bad Request. The right feedback to the client is a 404 page
       * and since graphql does not have a better error handling mechanism this is a dirty check.
       */
      if (
        error.graphQLErrors &&
        error.graphQLErrors.length > 0 &&
        error.graphQLErrors[0].message === '400: Bad Request'
      ) {
        return {
          statusCode: 404
        };
      }
      return {
        statusCode: 500
      };
    }
  }

  /**
   * Load more games when demanded
   */
  handleFetchMore = (currentPage: number, fetchMore) => {
    const { readingLevel } = this.props;
    logEvent('Navigation', 'More - Browse', readingLevel);

    fetchMore({
      variables: {
        page: currentPage + 1
      },
      updateQuery: (
        prev: BrowseGames,
        { fetchMoreResult }: { fetchMoreResult: BrowseGames }
      ) => {
        if (!fetchMoreResult) return prev;
        // Focus the first game of the extra games we're loading
        const toFocus = fetchMoreResult.games_v2.results[0];
        // Use a query selector to find the game we want to focus.
        const gameAnchor = document.querySelectorAll(
          `[href='/${toFocus.language}/games/details/${toFocus.id}']`
        )[1];
        gameAnchor && gameAnchor.focus();

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
    });
  };

  render() {
    const {
      router: { query },
      intl
    } = this.props;

    const readingLevel = 'Games';
    return (
      <Query
        query={BROWSE_GAMES_QUERY}
        variables={{
          page: INITIAL_PAGE_NUMBER,
          language: query.lang,
          pageSize: PAGE_SIZE
        }}
      >
        {({
          loading,
          error,
          data,
          fetchMore
        }: {
          data: BrowseGames,
          loading: boolean,
          error: any,
          fetchMore: ({}) => void
        }) => {
          const {
            games_v2: { pageInfo, results }
          } = data;

          return (
            <Layout>
              <Head
                title={intl.formatMessage({
                  id: 'Browse games',
                  defaultMessage: 'Browse games'
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
                      readingLevel ? (
                        <>
                          {/* $FlowFixMe This is the level from the query parameter. Which doesn't really typecheck */}
                          <ReadingLevelTrans readingLevel={readingLevel} />
                          <LevelHR
                            level={readingLevel}
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
                        id="No games found"
                        defaultMessage="No games found"
                      />
                    )}
                  </Typography>
                </GridContainer>
                <GridContainer>
                  {results.map(game => (
                    <GameLink key={game.id} game={game} />
                  ))}
                </GridContainer>
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
                      id="More games"
                      defaultMessage="More games"
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
