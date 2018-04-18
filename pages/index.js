// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import Head from 'next/head';

import { fetchFeaturedContent, fetchCategories, fetchBooks } from '../fetch';
import type {
  Book,
  Language,
  FeaturedContent,
  Context,
  Category,
  ReadingLevel
} from '../types';
import defaultPage from '../hocs/defaultPage';
import errorPage from '../hocs/errorPage';
import HomePage from '../components/HomePage';
import {
  setBookLanguageAndCategoryCookie,
  getBookLanguageFromCookie,
  getBookCategoryFromCookie
} from '../lib/cookie';

type Props = {|
  featuredContent: Array<FeaturedContent>,
  newArrivals: { results: Array<Book>, language: Language },
  levels: Array<ReadingLevel>,
  booksByLevel: Array<{ results: Array<Book> }>,
  category: Category,
  categories: Array<Category>,
  locationOrigin: string
|};

class BooksPage extends React.Component<Props> {
  static async getInitialProps({ query, asPath, req }: Context) {
    // Get the language either from the URL or the user's cookies
    const languageCode = query.lang || getBookLanguageFromCookie(req).code;

    const categoriesRes = await fetchCategories(languageCode);

    if (!categoriesRes.isOk) {
      const statusCode =
        categoriesRes.error && categoriesRes.error.code === 'VALIDATION'
          ? 404
          : categoriesRes.statusCode;

      return {
        statusCode
      };
    }

    const categories = categoriesRes.data;

    const categoryInCookie = getBookCategoryFromCookie(req);
    let category: Category;
    if (asPath.includes('/classroom')) {
      category = 'classroom_books';
    } else if (asPath.includes('/library')) {
      category = 'library_books';
    } else if (categoryInCookie && categoryInCookie in categories) {
      // Small check to make sure the value in the cookie is something valid
      if (categoryInCookie === 'classroom_books') {
        category = 'classroom_books';
      } else {
        category = 'library_books';
      }
    } else {
      // Default to library_books
      category =
        'library_books' in categories ? 'library_books' : 'classroom_books';
    }

    const levels = categories[category] || [];

    const results = await Promise.all([
      fetchFeaturedContent(languageCode),
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

    setBookLanguageAndCategoryCookie(newArrivals.language.code, category, req);

    // THe URL is needed so we can create a canonical URL
    const locationOrigin =
      req != null
        ? `${req.protocol}://${req.headers.host}`
        : window.location.origin;

    return {
      category,
      featuredContent,
      newArrivals,
      levels,
      booksByLevel,
      locationOrigin,
      categories: Object.keys(categories)
    };
  }

  render() {
    const {
      category,
      featuredContent,
      levels,
      booksByLevel,
      newArrivals,
      locationOrigin,
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
              href={`${locationOrigin}/${
                language.code
              }/books/category/${categoryTypeForUrl}`}
            />
            <meta
              property="og:url"
              content={`${locationOrigin}/${
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

export default defaultPage(errorPage(BooksPage));
