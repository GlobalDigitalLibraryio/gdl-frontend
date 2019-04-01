// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import type { $Request, $Response } from 'express';
import UniversalCookie from 'universal-cookie';
import getConfig from 'next/config';

import type { ConfigShape } from '../types';
import type { Category } from '../gqlTypes';

const {
  publicRuntimeConfig: { DEFAULT_LANGUAGE }
}: ConfigShape = getConfig();

const BOOK_LANGUAGE_KEY = 'bookLanguage';
const BOOK_CATEGORY_KEY = 'bookCategory';
const SITE_LANGUAGE_KEY = 'siteLanguage';

const oneMonthsInSeconds = 60 * 60 * 24 * 30; // approximately

const cookies = () => new UniversalCookie();

const ONE_MONTH_OPTIONS = {
  maxAge: oneMonthsInSeconds,
  path: '/'
};

/**
 * Set book language and category
 */
export function setBookLanguageAndCategory(
  languageCode: string,
  category: Category,
  res?: $Response
) {
  // Server
  if (res) {
    res.cookie(BOOK_LANGUAGE_KEY, languageCode, ONE_MONTH_OPTIONS);
    res.cookie(BOOK_CATEGORY_KEY, category, ONE_MONTH_OPTIONS);
  } else {
    // Client
    const c = cookies();
    c.set(BOOK_LANGUAGE_KEY, languageCode, ONE_MONTH_OPTIONS);
    c.set(BOOK_CATEGORY_KEY, category, ONE_MONTH_OPTIONS);
  }
}

export function getBookCategory(req?: $Request) {
  return req
    ? req.cookies[BOOK_CATEGORY_KEY]
    : cookies().get(BOOK_CATEGORY_KEY, { doNotParse: true });
}

/**
 * Get the language object from the cookies. Returns fallback language if not found
 */
export function getBookLanguageCode(req?: $Request): string {
  const language = req
    ? req.cookies[BOOK_LANGUAGE_KEY]
    : cookies().get(BOOK_LANGUAGE_KEY, { doNotParse: true });

  return language || DEFAULT_LANGUAGE.code;
}

export function getSiteLanguage(req?: $Request): string {
  const lang = req
    ? req.cookies[SITE_LANGUAGE_KEY]
    : cookies().get(SITE_LANGUAGE_KEY, { doNotParse: true });
  return lang || 'en';
}

export function setSiteLanguage(language?: string, callback?: () => void) {
  // Client
  const c = cookies();
  c.set(SITE_LANGUAGE_KEY, language, ONE_MONTH_OPTIONS);
  callback && callback();
}