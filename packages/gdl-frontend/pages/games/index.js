// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React from 'react';
import Router from 'next/router';
import getConfig from 'next/config';

import {
  LANGUAGE_SUPPORT_QUERY,
  LANGUAGES_QUERY,
  HOME_CONTENT_QUERY,
  CATEGORIES_QUERY
} from '../index';
import { withErrorPage } from '../../hocs';
import GamePage from '../../components/GamePage';
import {
  getBookLanguageCode,
  getBookCategory,
  setBookLanguageAndCategory
} from '../../lib/storage';
import { throwIfGraphql404 } from '../../utils/errorHandler';
import { AMOUNT_OF_ITEMS_PER_LEVEL } from '../../components/HomePage';
import QueryGameList, { GET_GAMES_QUERY } from '../../gql/QueryGameList';

import type { ConfigShape, Context } from '../../types';
import type {
  GameList,
  GameList_games_results as Games,
  GetCategories as Categories
} from '../../gqlTypes';

export const PAGE_SIZE = 30;

const {
  publicRuntimeConfig: { DEFAULT_LANGUAGE }
}: ConfigShape = getConfig();

type Props = {|
  languageCode: string,
  languageName: string,
  games: Games,
  languageHasBook: boolean,
  languageHasGame: boolean
|};

const GameIndexPage = ({
  languageCode,
  languageName,
  languageHasBook,
  languageHasGame
}: Props) => (
  <QueryGameList language={languageCode} pageSize={PAGE_SIZE}>
    {({ loading, games, loadMore }) => (
      <GamePage
        games={games}
        languageCode={languageCode}
        languageName={languageName}
        loading={loading}
        loadMore={loadMore}
        showBookButton={languageHasBook}
        showGameButton={languageHasGame}
      />
    )}
  </QueryGameList>
);

GameIndexPage.getInitialProps = async ({
  query,
  asPath,
  req,
  res,
  apolloClient
}: Context) => {
  try {
    // Get the language either from the URL or the user's cookies
    const languageCode = query.lang || getBookLanguageCode(req);

    const languagesRes = await apolloClient.query({
      query: LANGUAGES_QUERY
    });
    const language = languagesRes.data.languages.find(
      lang => lang.code === languageCode
    );
    const languageName = language.name;

    // Check if queried language is supported with content
    const langRes = await apolloClient.query({
      query: LANGUAGE_SUPPORT_QUERY,
      variables: { language: languageCode }
    });

    // Check if lanugange has content of type Book and/or Game
    const languageHasBook = langRes.data.languageSupport.includes('Book');
    const languageHasGame = langRes.data.languageSupport.includes('Game');

    /**
     * Prefetch books only if language is valid to improve toggling performance in menu
     * https://github.com/GlobalDigitalLibraryio/issues/issues/642
     */
    if (languageHasBook) {
      const categoriesRes: { data: Categories } = await apolloClient.query({
        query: CATEGORIES_QUERY,
        variables: {
          language: languageCode
        }
      });

      const categories = categoriesRes.data.categories;
      const categoryInCookie = getBookCategory(req);

      let category: string;
      if (asPath.includes('/classroom')) {
        category = 'Classroom';
      } else if (asPath.includes('/library')) {
        category = 'Library';
      } else if (categoryInCookie && categories.includes(categoryInCookie)) {
        // Small check to make sure the value in the cookie is something valid
        // $FlowFixMe: We know this is a valid category :/
        category = categoryInCookie;
      } else {
        // Default to Library
        category = categories.includes('Library') ? 'Library' : categories[0];
      }

      await apolloClient.query({
        query: HOME_CONTENT_QUERY,
        variables: {
          category,
          language: languageCode,
          pageSize: AMOUNT_OF_ITEMS_PER_LEVEL
        }
      });

      // $FlowFixMe: We know this is a valid category :/
      setBookLanguageAndCategory(languageCode, category, res);
    } else if (!languageHasBook && languageHasGame) {
      // set bookLanguage even if there are only games/ interactive content
      setBookLanguageAndCategory(languageCode, 'Library', res);
    }

    const gameContentResult: {
      data: GameList
    } = await apolloClient.query({
      query: GET_GAMES_QUERY,
      variables: {
        language: languageCode,
        pageSize: PAGE_SIZE
      }
    });

    const {
      data: { games }
    } = gameContentResult;

    /**
     * Some valid languages does not have game/ interactive content
     * If it has book content then the user will be redirected to the homepage for that language
     * Fallback/redirect to default language (english).
     */
    if (!languageHasGame && games.results.length === 0) {
      // We have different ways of redirecting on the server and on the client...
      // See https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
      if (languageHasBook) {
        const redirectUrlBooks = `/${languageCode}`;
        if (res) {
          res.writeHead(302, { Location: redirectUrlBooks });
          res.end();
        } else {
          Router.push(redirectUrlBooks);
        }
      } else {
        const redirectUrlDefault = `/${DEFAULT_LANGUAGE.code}`;
        if (res) {
          res.writeHead(302, { Location: redirectUrlDefault });
          res.end();
        } else {
          Router.push(redirectUrlDefault);
        }
        return {};
      }
    }

    return {
      languageCode,
      languageName,
      games,
      languageHasBook,
      languageHasGame
    };
  } catch (error) {
    throwIfGraphql404(error);
    return { statusCode: 500 };
  }
};

export default withErrorPage(GameIndexPage);
