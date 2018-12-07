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

import type { ConfigShape, FeaturedContent, Context, Category } from '../types';
import type { books as Books } from '../gqlTypes';

import { fetchFeaturedContent, fetchCategories } from '../fetch';
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

const QUERY = gql`
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
        variants {
          height
          width
          x
          y
          ratio
        }
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
  featuredContent: Array<FeaturedContent>,
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
      query: QUERY,
      variables: {
        language: languageCode,
        pageSize: AMOUNT_OF_BOOKS_PER_LEVEL
      }
    });

    // $FlowFixMe: Don't know why flow doesn't like this
    const categoriesRes = await fetchCategories(languageCode);

    if (!categoriesRes.isOk) {
      const statusCode =
        // If the categories endpoint doesn't get a valid language code, it throws with a VALIDATION error.
        // Because of the way we structure the URLs in the frontend, this means we should render the 404 page
        categoriesRes.error && categoriesRes.error.code === 'VALIDATION'
          ? 404
          : categoriesRes.statusCode;

      return {
        statusCode
      };
    }

    const categories = categoriesRes.data;
    const categoryInCookie = getBookCategory(req);

    let category: string;
    if (asPath.includes('/classroom')) {
      category = 'classroom_books';
    } else if (asPath.includes('/library')) {
      category = 'library_books';
    } else if (categoryInCookie && categoryInCookie in categories) {
      // Small check to make sure the value in the cookie is something valid
      // $FlowFixMe: We know this is a valid category :/
      category = categoryInCookie;
    } else {
      // Default to library_books
      category =
        'library_books' in categories ? 'library_books' : 'classroom_books';
    }

    const featuredContent = await fetchFeaturedContent(languageCode);
    if (!featuredContent.isOk) {
      return {
        statusCode: featuredContent.statusCode
      };
    }
    // $FlowFixMe: We know this is a valid category :/
    setBookLanguageAndCategory(languageCode, category, res);

    return {
      category,
      languageCode,
      featuredContent: featuredContent.data,
      bookSummaries: bookSummaries.data,
      categories: Object.keys(categories)
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
    if (category === 'library_books') {
      categoryTypeForUrl = 'library';
    } else if (category === 'classroom_books') {
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
