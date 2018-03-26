// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import Head from 'next/head';

import {
  fetchFeaturedContent,
  fetchCategories,
  fetchLanguages,
  fetchBooks
} from '../fetch';
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
import { LanguageCategory } from '../components/LanguageCategoryContext';

type Props = {|
  featuredContent: Array<FeaturedContent>,
  newArrivals: { results: Array<Book>, language: Language },
  levels: Array<ReadingLevel>,
  languages: Array<Language>,
  booksByLevel: Array<{ results: Array<Book> }>,
  category: Category,
  categories: Array<Category>,
  locationOrigin: string
|};

class BooksPage extends React.Component<Props> {
  static async getInitialProps({ query, asPath, req }: Context) {
    const language: ?string = query.lang;

    // $FlowFixMe: Unsure why flow complains here
    const results = await Promise.all([
      fetchLanguages(),
      fetchFeaturedContent(language),
      fetchCategories(language)
    ]);

    // If we have gotten languages successfully AND we have a language parameter AND that language isn't found in the list. Return a 404
    // This is a special case to get the front page to render 404s. Otherwise almost every page request would be considererd a language, such as /contact-us etc.
    if (
      results[0].isOk &&
      language &&
      !results[0].data.find(l => l.code === language)
    ) {
      return {
        statusCode: 404
      };
    }

    if (!results.every(res => res.isOk)) {
      return {
        // $FlowFixMe Come on flow...
        statusCode: results.find(res => !res.isOk).statusCode
      };
    }

    const [languages, featuredContent, categories] = results.map(
      result => result.data
    );

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

    const levels = categories[category] || [];

    const bookListsResults = await Promise.all([
      fetchBooks(language, { category: category }),
      ...levels.map(level =>
        fetchBooks(language, {
          level,
          category
        })
      )
    ]);

    if (!bookListsResults.every(res => res.isOk)) {
      return {
        statusCode: bookListsResults.find(res => !res.isOk).statusCode
      };
    }

    const [newArrivals, ...booksByLevel] = bookListsResults.map(
      result => result.data
    );

    // THe URL is needed so we can create a canonical URL
    const locationOrigin =
      req != null
        ? `${req.protocol}://${req.headers.host}`
        : window.location.origin;

    return {
      category,
      featuredContent,
      newArrivals,
      languages,
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
      languages,
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
      <LanguageCategory category={category} language={newArrivals.language}>
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
          category={category}
          categories={categories}
          languages={languages}
          levels={levels}
          newArrivals={newArrivals}
          booksByLevel={booksByLevel}
          featuredContent={featuredContent}
        />
      </LanguageCategory>
    );
  }
}

export default defaultPage(errorPage(BooksPage));
