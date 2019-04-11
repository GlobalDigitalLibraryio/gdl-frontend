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
  BooksAndFeatured,
  BooksAndFeatured_featuredContent as FeaturedContent,
  GetCategories as Categories
} from '../gqlTypes';

import { withErrorPage } from '../hocs';
import HomePage from '../components/HomePage';
import {
  setBookLanguageAndCategory,
  getBookLanguageCode,
  getBookCategory
} from '../lib/storage';

const {
  publicRuntimeConfig: { canonicalUrl, DEFAULT_LANGUAGE }
}: ConfigShape = getConfig();

const AMOUNT_OF_BOOKS_PER_LEVEL = 5;

type Props = {|
  homeTutorialStatus: boolean,
  category: Category,
  categories: Array<Category>,
  languageCode: string,
  featuredContent: FeaturedContent,
  bookSummaries: $Diff<
    BooksAndFeatured,
    { featuredContent: Array<FeaturedContent> }
  >
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

      const booksAndFeatured: {
        data: BooksAndFeatured
      } = await apolloClient.query({
        query: BOOKS_AND_FEATURED_QUERY,
        variables: {
          category,
          language: languageCode,
          pageSize: AMOUNT_OF_BOOKS_PER_LEVEL
        }
      });

      const {
        data: { games }
      } = await apolloClient.query({
        query: GAMES_QUERY,
        variables: {
          language: languageCode
        }
      });

      // $FlowFixMe: We know this is a valid category :/
      setBookLanguageAndCategory(languageCode, category, res);

      const {
        data: { featuredContent, ...bookSummaries }
      } = booksAndFeatured;

      return {
        games,
        category,
        categories,
        languageCode,
        // Currently the UI only supports one featured content, not an array
        featuredContent: featuredContent[0],
        bookSummaries
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
      games,
      bookSummaries,
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
          games={games}
          bookSummaries={bookSummaries}
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

const CATEGORIES_QUERY = gql`
  query GetCategories($language: String!) {
    categories(language: $language)
  }
`;

const GAMES_QUERY = gql`
  query Games($language: String) {
    games(language: $language) {
      id
      title
      description
      url
      source
      publisher
      license
      language
      coverImage {
        imageId
        url
        altText
      }
    }
  }
`;

const BOOKS_AND_FEATURED_QUERY = gql`
  query BooksAndFeatured(
    $language: String!
    $category: Category!
    $pageSize: Int
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
    NewArrivals: bookSummaries(
      language: $language
      category: $category
      orderBy: arrivalDate_DESC
      pageSize: $pageSize
    ) {
      ...fields
    }
    Decodable: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Decodable
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level1: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Level1
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level2: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Level2
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level3: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Level3
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level4: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Level4
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
    ReadAloud: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: ReadAloud
      category: $category
      orderBy: title_ASC
    ) {
      ...fields
    }
  }

  fragment fields on ResultItemConnection {
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
