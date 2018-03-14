// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
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
  CategoryType
} from '../types';
import defaultPage from '../hocs/defaultPage';
import HomePage from '../components/HomePage';

type Props = {
  featuredContent: RemoteData<Array<FeaturedContent>>,
  newArrivals: RemoteData<{ results: Array<Book>, language: Language }>,
  levels: RemoteData<Array<string>>,
  languages: RemoteData<Array<Language>>,
  booksByLevel: Array<RemoteData<{ results: Array<Book> }>>,
  categoryType: CategoryType
};

class BooksPage extends React.Component<Props> {
  static async getInitialProps({ query, accessToken, asPath }: Context) {
    const language: ?string = query.lang;

    // Fetch these first, cause they don't use the reading levels or categories
    const [featuredContent, categories, languages] = await Promise.all([
      fetchFeaturedContent(language)(accessToken),
      fetchCategories(language)(accessToken),
      fetchLanguages()(accessToken)
    ]);

    // Default to library_books
    const categoryType: CategoryType =
      'library_books' in categories ? 'library_books' : 'classroom_books';

    const levels = categories.library_books
      ? categories.library_books.readingLevels
      : categories.classroom_books.readingLevels;

    // Levels are just stringified single digits for now, so this is okay. Revisit when we have other levels
    levels.sort();

    const [newArrivals, ...booksByLevel] = await Promise.all([
      fetchBooks(language, { category: categoryType })(accessToken),
      ...levels.map(level =>
        fetchBooks(language, {
          level,
          category: categoryType
        })(accessToken)
      )
    ]);

    return {
      featuredContent,
      newArrivals,
      languages,
      levels,
      booksByLevel,
      categoryType
    };
  }

  render() {
    const {
      featuredContent,
      languages,
      levels,
      booksByLevel,
      newArrivals,
      categoryType
    } = this.props;

    // If we don't have any levels, we assume it's a 404
    if (levels.length === 0) {
      return <ErrorPage statusCode={404} />;
    }

    return (
      <HomePage
        categoryType={categoryType}
        languages={languages}
        levels={levels}
        newArrivals={newArrivals}
        booksByLevel={booksByLevel}
        featuredContent={featuredContent}
      />
    );
  }
}

export default defaultPage(BooksPage);
