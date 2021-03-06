// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import gql from 'graphql-tag';
import Router from 'next/router';

import type { ConfigShape, Context } from '../types';
import type {
  Category,
  HomeContent,
  HomeContent_featuredContent as FeaturedContent,
  GetCategories as Categories
} from '../gqlTypes';

import { withErrorPage } from '../hocs';
import HomePage, { AMOUNT_OF_ITEMS_PER_LEVEL } from '../components/HomePage';
import {
  setBookLanguageAndCategory,
  getBookLanguageCode,
  getBookCategory,
  getSiteLanguage
} from '../lib/storage';
import { throwIfGraphql404 } from '../utils/errorHandler';

import { GET_GAMES_QUERY } from '../gql/QueryGameList';

const {
  publicRuntimeConfig: { canonicalUrl, DEFAULT_LANGUAGE }
}: ConfigShape = getConfig();

type Props = {|
  homeTutorialStatus: boolean,
  category: Category,
  categories: Array<Category>,
  languageCode: string,
  featuredContent: Array<FeaturedContent>,
  homeContent: HomeContent,
  languageHasBook: boolean,
  languageHasGame: boolean
|};

class IndexPage extends React.Component<Props> {
  static async getInitialProps({
    query,
    asPath,
    req,
    res,
    apolloClient
  }: Context) {
    try {
      // Get the language either from the URL or the user's cookies
      const languageCode = query.lang || getBookLanguageCode(req);
      const siteLanguage = query.lang || getSiteLanguage(req);

      // Check if queried language is supported with content
      const langRes = await apolloClient.query({
        query: LANGUAGE_SUPPORT_QUERY,
        variables: { language: languageCode }
      });

      // Check if lanugange has content of type Book and/or Game
      const languageHasBook = langRes.data.languageSupport.includes('Book');
      const languageHasGame = langRes.data.languageSupport.includes('Game');

      const categoriesRes: { data: Categories } = await apolloClient.query({
        query: CATEGORIES_QUERY,
        variables: {
          language: languageCode
        }
      });

      /**
       * Some valid languages does not have content and will eventually return empty categories.
       * If the language has games/ interactive content but no books redirect to /games page.
       * Else fallback/redirect to default language (english).
       */
      if (!languageHasBook && categoriesRes.data.categories.length === 0) {
        // We have different ways of redirecting on the server and on the client...
        // See https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
        if (languageHasGame) {
          const redirectUrlGames = `/${languageCode}/games`;
          if (res) {
            res.writeHead(302, { Location: redirectUrlGames });
            res.end();
          } else {
            Router.push(redirectUrlGames);
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

      const homeContentResult: {
        data: HomeContent
      } = await apolloClient.query({
        query: HOME_CONTENT_QUERY,
        variables: {
          category,
          language: languageCode,
          pageSize: AMOUNT_OF_ITEMS_PER_LEVEL
        }
      });

      /**
       * Prefetch games to improve toggling performance in menu
       * https://github.com/GlobalDigitalLibraryio/issues/issues/642
       */
      await apolloClient.query({
        query: GET_GAMES_QUERY,
        variables: {
          language: languageCode,
          pageSize: AMOUNT_OF_ITEMS_PER_LEVEL
        }
      });

      // $FlowFixMe: We know this is a valid category :/
      setBookLanguageAndCategory(languageCode, category, res);

      const {
        data: { featuredContent, ...homeContent }
      } = homeContentResult;

      return {
        category,
        categories,
        languageCode,
        // Currently the UI only supports one featured content, not an array
        featuredContent: featuredContent,
        homeContent,
        // site languge from cookie
        siteLanguage,
        languageHasBook,
        languageHasGame
      };
    } catch (error) {
      throwIfGraphql404(error);
      return {
        statusCode: 500
      };
    }
  }

  // Ensure cookies are set, even if the rendered HTML came from the cache on the server
  componentDidMount() {
    setBookLanguageAndCategory(this.props.languageCode, this.props.category);
  }

  render() {
    const {
      homeContent,
      category,
      featuredContent,
      categories,
      languageCode,
      languageHasBook,
      languageHasGame
    } = this.props;

    let categoryTypeForUrl;
    if (category === 'Library') {
      categoryTypeForUrl = 'library';
    } else if (category === 'Classroom') {
      categoryTypeForUrl = 'classroom';
    }

    return (
      <>
        {categoryTypeForUrl && (
          <Head>
            <link
              rel="canonical"
              href={`${canonicalUrl}/${languageCode}/books/category/${categoryTypeForUrl}`}
            />
            <meta
              property="og:url"
              content={`${canonicalUrl}/${languageCode}/books/category/${categoryTypeForUrl}`}
            />
          </Head>
        )}
        <HomePage
          homeContent={homeContent}
          category={category}
          categories={categories}
          languageCode={languageCode}
          featuredContent={featuredContent}
          showGameButton={languageHasGame}
          showBookButton={languageHasBook}
        />
      </>
    );
  }
}

export default withErrorPage(IndexPage);

export const LANGUAGE_SUPPORT_QUERY = gql`
  query CheckLanguageSupport($language: String!) {
    languageSupport(language: $language)
  }
`;

export const LANGUAGES_QUERY = gql`
  query languages {
    languages {
      code
      name
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  query GetCategories($language: String!) {
    categories(language: $language)
  }
`;

export const HOME_CONTENT_QUERY = gql`
  query HomeContent(
    $language: String!
    $category: Category!
    $pageSize: Int
    $page: Int
  ) {
    featuredContent(language: $language) {
      id
      title
      description
      link
      imageUrl
      language {
        code
      }
    }
    Decodable: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level1: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Level1
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level2: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Level2
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level3: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Level3
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level4: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Level4
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level5: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Level5
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level6: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Level6
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    ReadAloud: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: ReadAloud
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
  }

  fragment fields on ResultItemConnection {
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
`;
