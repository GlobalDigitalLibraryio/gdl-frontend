// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React from 'react';
import gql from 'graphql-tag';

import type { Context } from '../../types';
import type { GameContent, GameContent_games as Games } from '../../gqlTypes';

import { withErrorPage } from '../../hocs';
import GamePage from '../../components/GamePage';
import { getBookLanguageCode } from '../../lib/storage';

type Props = {|
  languageCode: string,
  games: Games
|};

class GameIndexPage extends React.Component<Props> {
  static async getInitialProps({ query, req, apolloClient }: Context) {
    try {
      // Get the language either from the URL or the user's cookies
      const languageCode = query.lang || getBookLanguageCode(req);

      const gameContentResult: {
        data: GameContent
      } = await apolloClient.query({
        query: GAME_CONTENT_QUERY,
        variables: {
          language: languageCode,
          pageSize: 5
        }
      });

      const {
        data: { games }
      } = gameContentResult;

      return {
        languageCode,
        games
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

  render() {
    const { games, languageCode } = this.props;

    return <GamePage games={games} languageCode={languageCode} />;
  }
}

export default withErrorPage(GameIndexPage);

const GAME_CONTENT_QUERY = gql`
  query GameContent($language: String!, $pageSize: Int, $page: Int) {
    games: games_v2(language: $language, pageSize: $pageSize, page: $page) {
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
