// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { withApollo } from 'react-apollo';

import { withErrorPage } from '../../hocs';
import { GAME_QUERY } from './_game';
import { Router } from '../../routes';
import PlayGamePage from '../../components/PlayGamePage';

import type { game_game as Game } from '../../gqlTypes';
import type { Context } from '../../types';

/**
 * Right now /games/play only support H5P games
 */
const Play = ({ game }: { game: Game }) => {
  const onClose = () =>
    Router.replaceRoute('game', {
      id: game.id,
      lang: game.language
    });

  return <PlayGamePage game={game} onClose={onClose} />;
};

Play.getInitialProps = async ({ query, req, apolloClient }: Context) => {
  try {
    const { data } = await apolloClient.query({
      query: GAME_QUERY,
      variables: { id: query.id }
    });
    const isH5P = data.game.url.includes('gdl.h5p');
    return isH5P ? { game: data.game } : { statusCode: 404 };
  } catch (error) {
    /*
     * If user request invalid query param to graphql you trigger bad input validation
     * and receive 400: Bad Request. The right feedback to the client is a 404 page
     * and since graphql does not have a better error handling mechanism this is a dirty check.
     */
    if (
      error.graphQLErrors &&
      error.graphQLErrors.length > 0 &&
      (error.graphQLErrors[0].message === '400: Bad Request' ||
        error.graphQLErrors[0].message === '404: Not Found')
    ) {
      return {
        statusCode: 404
      };
    }
    return {
      statusCode: 500
    };
  }
};

export default withErrorPage(withApollo(Play));
