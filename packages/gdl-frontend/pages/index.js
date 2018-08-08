// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import Head from 'next/head';
import getConfig from 'next/config';

import { fetchFeaturedContent, fetchCategories, fetchBooks } from '../fetch';
import type {
  ConfigShape,
  Book,
  Language,
  FeaturedContent,
  Context,
  Category,
  ReadingLevel
} from '../types';
import { errorPage } from '../hocs';
import HomePage from '../components/HomePage';
import {
  setBookLanguageAndCategory,
  getBookLanguageCode,
  getBookCategory
} from '../lib/storage';

const {
  publicRuntimeConfig: { canonicalUrl }
}: ConfigShape = getConfig();

type Props = {|
  featuredContent: Array<FeaturedContent>,
  newArrivals: { results: Array<Book>, language: Language },
  levels: Array<ReadingLevel>,
  booksByLevel: Array<{ results: Array<Book> }>,
  category: Category,
  categories: Array<Category>
|};

class IndexPage extends React.Component<Props> {
  static async getInitialProps({ query, asPath, req, res }: Context) {
    // Get the language either from the URL or the user's cookies
    const languageCode = query.lang || getBookLanguageCode(req);

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
    let category: Category;
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

    // Make sure levels is a valid array for the upcoming `map`
    const levels = categories[category] || [];

    const results = await Promise.all([
      fetchFeaturedContent(languageCode),
      // $FlowFixMe: We know this is a valid category :/
      fetchBooks(languageCode, { category: category }),
      ...levels.map(level =>
        fetchBooks(languageCode, {
          level,
          category,
          sort: 'title'
        })
      )
    ]);

    if (!results.every(res => res.isOk)) {
      return {
        statusCode: results.find(res => !res.isOk).statusCode
      };
    }

    const [featuredContent, newArrivals, ...booksByLevel] = results.map(
      result => result.data
    );

    // $FlowFixMe: We know this is a valid category :/
    setBookLanguageAndCategory(newArrivals.language, category, res);

    return {
      category,
      featuredContent,
      newArrivals,
      levels,
      booksByLevel,
      categories: Object.keys(categories)
    };
  }

  // Ensure cookies are set, even if the rendered HTML came from the cache on the server
  componentDidMount() {
    setBookLanguageAndCategory(
      this.props.newArrivals.language,
      this.props.category
    );
  }

  render() {
    const {
      category,
      featuredContent,
      levels,
      booksByLevel,
      newArrivals,
      categories
    } = this.props;

    const language = newArrivals.language;

    let categoryTypeForUrl;
    if (category === 'library_books') {
      categoryTypeForUrl = 'library';
    } else if (category === 'classroom_books') {
      categoryTypeForUrl = 'classroom';
    }

    return (
      <Fragment>
        {categoryTypeForUrl && (
          <Head>
            <link
              rel="canonical"
              href={`${canonicalUrl}/${
                language.code
              }/books/category/${categoryTypeForUrl}`}
            />
            <meta
              property="og:url"
              content={`${canonicalUrl}/${
                language.code
              }/books/category/${categoryTypeForUrl}`}
            />
          </Head>
        )}
        <HomePage
          category={category}
          categories={categories}
          levels={levels}
          newArrivals={newArrivals}
          booksByLevel={booksByLevel}
          featuredContent={featuredContent}
        />
      </Fragment>
    );
  }
}

export default errorPage(IndexPage);
