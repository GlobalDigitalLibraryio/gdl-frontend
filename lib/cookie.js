// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import type { $Request } from 'express';
import Cookie from 'cookie-dough';
import type { Category } from '../types';

const BOOK_LANGUAGE_KEY = 'bookLanguage';
const BOOK_CATEGORY_KEY = 'bookCategory';

const oneMonthsInSeconds = 60 * 60 * 24 * 30; // approximately

/**
 * Set book language and category
 */
export function setBookLanguageAndCategoryCookie(
  languageCode: string,
  category: Category,
  req?: $Request
) {
  const c = Cookie(req);

  c.set(BOOK_LANGUAGE_KEY, languageCode, {
    maxAge: oneMonthsInSeconds,
    path: '/'
  });

  c.set(BOOK_CATEGORY_KEY, category, {
    maxAge: oneMonthsInSeconds,
    path: '/'
  });
}

export function getBookLanguageFromCookie(req?: $Request) {
  return Cookie(req).get(BOOK_LANGUAGE_KEY);
}

export function getBookCategoryFromCookie(req?: $Request) {
  return Cookie(req).get(BOOK_CATEGORY_KEY);
}
