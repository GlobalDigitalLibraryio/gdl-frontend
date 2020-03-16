// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React from 'react';
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

import type { Context } from '../../types';
import type {
  GameList,
  GameList_games_results as Games,
  GetCategories as Categories
} from '../../gqlTypes';

export const PAGE_SIZE = 30;

type Props = {|
  languageCode: string,
  languageName: string,
  games: Games
|};

const GameIndexPage = ({ languageCode, languageName }: Props) => (
  <QueryGameList language={languageCode} pageSize={PAGE_SIZE}>
    {({ loading, games, loadMore }) => (
      <GamePage
        games={games}
        languageCode={languageCode}
        languageName={languageName}
        loading={loading}
        loadMore={loadMore}
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

    /**
     * Prefetch books only if language is valid to improve toggling performance in menu
     * https://github.com/GlobalDigitalLibraryio/issues/issues/642
     */
    if (langRes.data.languageSupport) {
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

    return { languageCode, languageName, games };
  } catch (error) {
    throwIfGraphql404(error);
    return { statusCode: 500 };
  }
};

export default withErrorPage(GameIndexPage);
