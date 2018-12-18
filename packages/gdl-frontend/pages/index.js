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

import type { ConfigShape, Context, Category } from '../types';
import type {
  books as Books,
  FeaturedContent_featuredContent as FeaturedContent
} from '../gqlTypes';

import { withErrorPage } from '../hocs';
import HomePage from '../components/HomePage';
import {
  setBookLanguageAndCategory,
  getBookLanguageCode,
  getBookCategory
} from '../lib/storage';

const {
  publicRuntimeConfig: { canonicalUrl }
}: ConfigShape = getConfig();

const AMOUNT_OF_BOOKS_PER_LEVEL = 5;

const FEATURED_CONTENT_QUERY = gql`
  query FeaturedContent($language: String) {
    featuredContent(language: $language) {
      id
      title
      description
      link
      imageUrl
      language {
        code
        name
      }
    }
  }
`;

const CATEGORY_QUERY = gql`
  query GetCategories($language: String!) {
    categories(language: $language)
  }
`;

const BOOK_QUERY = gql`
  query books($language: String!, $pageSize: Int) {
    Decodable: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Decodable
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level1: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Level1
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level2: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Level2
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level3: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Level3
      orderBy: title_ASC
    ) {
      ...fields
    }
    Level4: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: Level4
      orderBy: title_ASC
    ) {
      ...fields
    }
    ReadAloud: bookSummaries(
      language: $language
      pageSize: $pageSize
      readingLevel: ReadAloud
      orderBy: title_ASC
    ) {
      ...fields
    }
    NewArrivals: bookSummaries(
      language: $language
      orderBy: arrivalDate_DESC
      pageSize: $pageSize
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

type Props = {|
  bookSummaries: Books,
  languageCode: string,
  featuredContent: FeaturedContent,
  category: Category,
  categories: Array<Category>
|};

class IndexPage extends React.Component<Props> {
  static async getInitialProps({
    query,
    asPath,
    req,
    res,
    apolloClient
  }: Context) {
    // Get the language either from the URL or the user's cookies
    const languageCode = query.lang || getBookLanguageCode(req);
    const bookSummaries = await apolloClient.query({
      query: BOOK_QUERY,
      variables: {
        language: languageCode,
        pageSize: AMOUNT_OF_BOOKS_PER_LEVEL
      }
    });

    const categoriesRes = await apolloClient.query({
      query: CATEGORY_QUERY,
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
      category = categories.includes('Library') ? 'Library' : 'Classroom';
    }

    const featureRes = await apolloClient.query({
      query: FEATURED_CONTENT_QUERY,
      language: languageCode
    });

    // $FlowFixMe: We know this is a valid category :/
    setBookLanguageAndCategory(languageCode, category, res);

    return {
      category,
      categories,
      languageCode,
      // Currently the UI only supports one featured content, not an array
      featuredContent: featureRes.data.featuredContent[0],
      bookSummaries: bookSummaries.data
    };
  }

  // Ensure cookies are set, even if the rendered HTML came from the cache on the server
  componentDidMount() {
    setBookLanguageAndCategory(this.props.languageCode, this.props.category);
  }

  render() {
    const {
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
