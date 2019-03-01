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
const BOOKDETAILS_TUTORIAL_STATUS_KEY = 'bookDetailsTutorialFinished';
const HOME_TUTORIAL_STATUS_KEY = 'homeTutorialFinished';

const oneMonthsInSeconds = 60 * 60 * 24 * 30; // approximately
const sixMonthsInSeconds = oneMonthsInSeconds * 6;

const cookies = () => new UniversalCookie();

const ONE_MONTH_OPTIONS = {
  maxAge: oneMonthsInSeconds,
  path: '/'
};

const SIX_MONTHS_OPTIONS = {
  maxAge: sixMonthsInSeconds,
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

export function setFinishedHomeTutorial(callback?: () => void) {
  const c = cookies();
  c.set(HOME_TUTORIAL_STATUS_KEY, true, SIX_MONTHS_OPTIONS);
  callback && callback();
}

export function getHomeTutorialStatus(req?: $Request): boolean {
  const hasFinished = req
    ? req.cookies[HOME_TUTORIAL_STATUS_KEY]
    : cookies().get(HOME_TUTORIAL_STATUS_KEY, { doNotParse: false });
  return hasFinished === 'true' || hasFinished === true || false;
}

export function setFinishedBookDetailsTutorial(callback?: () => void) {
  const c = cookies();
  c.set(BOOKDETAILS_TUTORIAL_STATUS_KEY, true, SIX_MONTHS_OPTIONS);
  callback && callback();
}

export function getBookDetailsTutorialStatus(req?: $Request): boolean {
  const hasFinished = req
    ? req.cookies[BOOKDETAILS_TUTORIAL_STATUS_KEY]
    : cookies().get(BOOKDETAILS_TUTORIAL_STATUS_KEY, { doNotParse: false });
  return hasFinished === 'true' || hasFinished === true || false;
}

export function clearTutorial() {
  const c = cookies();
  c.remove(HOME_TUTORIAL_STATUS_KEY, SIX_MONTHS_OPTIONS);
  c.remove(BOOKDETAILS_TUTORIAL_STATUS_KEY, SIX_MONTHS_OPTIONS);
}
