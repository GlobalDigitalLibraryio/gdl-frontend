// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import Head from 'next/head';
import ErrorPage from './_error';

import {
  fetchFeaturedContent,
  fetchCategories,
  fetchLanguages,
  fetchBooks
} from '../fetch';
import type {
  Book,
  Language,
  RemoteData,
  FeaturedContent,
  Context,
  Category
} from '../types';
import defaultPage from '../hocs/defaultPage';
import HomePage from '../components/HomePage';

type Props = {
  featuredContent: RemoteData<Array<FeaturedContent>>,
  newArrivals: RemoteData<{ results: Array<Book>, language: Language }>,
  levels: RemoteData<Array<string>>,
  languages: RemoteData<Array<Language>>,
  booksByLevel: Array<RemoteData<{ results: Array<Book> }>>,
  categoryType: Category,
  locationOrigin: string
};

class BooksPage extends React.Component<Props> {
  static async getInitialProps({ query, accessToken, asPath, req }: Context) {
    const language: ?string = query.lang;

    // Fetch these first, cause they don't use the reading levels or categories
    const [featuredContent, categories, languages] = await Promise.all([
      fetchFeaturedContent(language)(accessToken),
      fetchCategories(language)(accessToken),
      fetchLanguages()(accessToken)
    ]);

    let category: Category;

    if (asPath.includes('/classroom')) {
      category = 'classroom_books';
    } else if (asPath.includes('/library')) {
      category = 'library_books';
    } else {
      // Default to library_books
      category =
        'library_books' in categories ? 'library_books' : 'classroom_books';
    }

    const levels = categories[category]
      ? categories[category].readingLevels
      : [];

    // Levels are just stringified single digits for now, so this is okay. Revisit when we have other levels
    levels.sort();

    const [newArrivals, ...booksByLevel] = await Promise.all([
      fetchBooks(language, { category: category })(accessToken),
      ...levels.map(level =>
        fetchBooks(language, {
          level,
          category
        })(accessToken)
      )
    ]);

    const locationOrigin =
      req != null
        ? `${req.protocol}://${req.headers.host}`
        : window.location.origin;

    return {
      featuredContent,
      newArrivals,
      languages,
      levels,
      booksByLevel,
      locationOrigin
    };
  }

  render() {
    const {
      featuredContent,
      languages,
      levels,
      booksByLevel,
      newArrivals,
      locationOrigin
    } = this.props;

    // If we don't have any levels, we assume it's a 404
    if (levels.length === 0) {
      return <ErrorPage statusCode={404} />;
    }

    const language = newArrivals.language;
    const category = newArrivals.results[0].category;

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
          </Head>
        )}
        <HomePage
          languages={languages}
          levels={levels}
          newArrivals={newArrivals}
          booksByLevel={booksByLevel}
          featuredContent={featuredContent}
        />
      </Fragment>
    );
  }
}

export default defaultPage(BooksPage);
