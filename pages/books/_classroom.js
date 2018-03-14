// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import ErrorPage from '../_error';

import {
  fetchFeaturedContent,
  fetchCategories,
  fetchLanguages,
  fetchBooks
} from '../../fetch';
import type {
  Book,
  Language,
  RemoteData,
  FeaturedContent,
  Context
} from '../../types';
import defaultPage from '../../hocs/defaultPage';
import HomePage from '../../components/HomePage';

type Props = {
  featuredContent: RemoteData<Array<FeaturedContent>>,
  newArrivals: RemoteData<{ results: Array<Book>, language: Language }>,
  levels: RemoteData<Array<string>>,
  languages: RemoteData<Array<Language>>,
  booksByLevel: Array<RemoteData<{ results: Array<Book> }>>
};

class BooksPage extends React.Component<Props> {
  static async getInitialProps({ query, accessToken }: Context) {
    const language: string = query.lang;

    // Fetch these first, cause they don't use the reading level
    const [
      featuredContent,
      categories,
      languages,
      newArrivals
    ] = await Promise.all([
      fetchFeaturedContent(language)(accessToken),
      fetchCategories(language)(accessToken),
      fetchLanguages()(accessToken),
      fetchBooks(language, { category: 'classroom_books' })(accessToken)
    ]);

    const levels = categories.classroom_books
      ? categories.classroom_books.readingLevels.sort()
      : [];

    const booksByLevel = await Promise.all(
      levels.map(level =>
        fetchBooks(language, {
          level,
          category: 'classroom_books'
        })(accessToken)
      )
    );

    return {
      featuredContent,
      newArrivals,
      languages,
      levels,
      booksByLevel
    };
  }

  render() {
    const {
      featuredContent,
      languages,
      levels,
      booksByLevel,
      newArrivals
    } = this.props;

    if (levels.length === 0) {
      return <ErrorPage statusCode={404} />;
    }

    return (
      <HomePage
        categoryType="classroom_books"
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
