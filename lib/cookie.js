// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import type { $Request } from 'express';
import UniversalCookie from 'universal-cookie';
import type { Category, Language } from '../types';

const BOOK_LANGUAGE_CODE_KEY = 'bookLanguageCode';
const BOOK_LANGUAGE_KEY = 'bookLanguage';
const BOOK_CATEGORY_KEY = 'bookCategory';

const oneMonthsInSeconds = 60 * 60 * 24 * 30; // approximately

// On the server we need to pass in the cookie object in the constructor
const cookies = req => new UniversalCookie(req ? req.headers.cookie : null);

/**
 * Set book language and category
 */
export function setBookLanguageAndCategoryCookie(
  languageCode: string,
  category: Category,
  req?: $Request
) {
  const c = cookies(req);

  c.set(BOOK_LANGUAGE_CODE_KEY, languageCode, {
    maxAge: oneMonthsInSeconds,
    path: '/'
  });

  c.set(BOOK_CATEGORY_KEY, category, {
    maxAge: oneMonthsInSeconds,
    path: '/'
  });
}

/**
 * Set book language
 */
export function setBookLanguageCookie(languageCode: string) {
  const c = cookies();

  c.set(BOOK_LANGUAGE_CODE_KEY, languageCode, {
    maxAge: oneMonthsInSeconds,
    path: '/'
  });
}

export function getBookLanguageCodeFromCookie(req?: $Request) {
  return cookies(req).get(BOOK_LANGUAGE_KEY);
}

export function getBookCategoryFromCookie(req?: $Request) {
  return cookies(req).get(BOOK_CATEGORY_KEY);
}

export function setBookLanguageInCookie(language: Language) {
  const c = cookies();

  c.set(BOOK_LANGUAGE_KEY, language, {
    maxAge: oneMonthsInSeconds,
    path: '/'
  });
}

/**
 * Get the language object from the cookies. Fallbacks to English if not found
 */
export function getBookLanguageFromCookie(req?: $Request): Language {
  return cookies(req).get(BOOK_LANGUAGE_KEY) || { code: 'en', name: 'English' };
}
