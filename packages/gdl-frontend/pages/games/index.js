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
import type {
  GameContent,
  GameContent_games as Games,
  GetCategories as Categories
} from '../../gqlTypes';
import {
  LANGUAGE_SUPPORT_QUERY,
  HOME_CONTENT_QUERY,
  CATEGORIES_QUERY
} from '../index';
import { withErrorPage } from '../../hocs';
import GamePage from '../../components/GamePage';
import {
  getBookLanguageCode,
  getSiteLanguage,
  getBookCategory,
  setBookLanguageAndCategory
} from '../../lib/storage';
import { throwIfGraphql404 } from '../../utils/errorHandler';
import { AMOUNT_OF_ITEMS_PER_LEVEL } from '../../components/HomePage';

type Props = {|
  languageCode: string,
  games: Games
|};

const GameIndexPage = ({ games, languageCode }: Props) => (
  <GamePage games={games} languageCode={languageCode} />
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
    const siteLanguage = query.lang || getSiteLanguage(req);

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

    return { languageCode, games };
  } catch (error) {
    throwIfGraphql404(error);
    return { statusCode: 500 };
  }
};

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
