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

const {
  publicRuntimeConfig: { canonicalUrl, DEFAULT_LANGUAGE }
}: ConfigShape = getConfig();

type Props = {|
  homeTutorialStatus: boolean,
  category: Category,
  categories: Array<Category>,
  languageCode: string,
  featuredContent: FeaturedContent,
  homeContent: HomeContent
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

      if (!langRes.data.languageSupport) {
        return { statusCode: 404 };
      }

      const categoriesRes: { data: Categories } = await apolloClient.query({
        query: CATEGORIES_QUERY,
        variables: {
          language: languageCode
        }
      });

      /**
       * Some valid languages does not have content and will eventually return empty categories.
       * Fallback/redirect to default language (english).
       */
      if (categoriesRes.data.categories.length === 0) {
        // We have different ways of redirecting on the server and on the client...
        // See https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
        const redirectUrl = `/${DEFAULT_LANGUAGE.code}`;
        if (res) {
          res.writeHead(302, { Location: redirectUrl });
          res.end();
        } else {
          Router.push(redirectUrl);
        }
        return {};
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
        featuredContent: featuredContent[0],
        homeContent,
        // site languge from cookie
        siteLanguage
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
      languageCode
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
        />
      </>
    );
  }
}

export default withErrorPage(IndexPage);

const LANGUAGE_SUPPORT_QUERY = gql`
  query CheckLanguageSupport($language: String!) {
    languageSupport(language: $language)
  }
`;

const CATEGORIES_QUERY = gql`
  query GetCategories($language: String!) {
    categories(language: $language)
  }
`;

const HOME_CONTENT_QUERY = gql`
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
    Decodable1: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable1
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable2: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable2
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable3: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable3
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable4: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable4
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable5: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable5
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable6: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable6
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable7: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable7
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable8: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable8
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable9: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable9
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable10: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable10
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable11: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable11
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Decodable12: bookSummaries(
      language: $language
      pageSize: $pageSize
      page: $page
      readingLevel: Decodable12
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
    Games: games_v2(language: $language, pageSize: $pageSize, page: $page) {
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
