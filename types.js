// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import type { $Request, $Response } from 'express';

export type Publisher = {
  +id: number,
  +name: string
};

export type Contributor = {
  +id: number,
  +name: string
};

export type License = {
  +name: string,
  +description: string,
  +url: string
};

export type Language = {
  +code: string,
  +name: string
};

export type Chapter = {
  content: string,
  seqNo: number
};

export type ChapterSummary = {
  url: string,
  seqNo: number
};

// Future proofing. In the future we might want to define success and failure cases using ADTs
export type RemoteData<T> = T;

export type CoverPhoto = {
  large: string,
  small: string
};

export type Translation = {
  translatedFrom: Language,
  translatedTo: Language,
  id: number,
  crowdinUrl: string,
  synchronizeUrl: string,
  title: string,
  publisher: {
    name: string
  },
  coverPhoto?: CoverPhoto
};

export type Category = $ReadOnly<{|
  +name: 'library_books' | 'classroom_books'
|}>;

export type Book = $ReadOnly<{|
  id: number,
  title: string,
  description: string,
  categories: Array<Category>,
  highlightTitle?: string,
  highlightDescription?: string,
  readingLevel: string,
  language: Language,
  coverPhoto?: CoverPhoto
|}>;

export type BookDetails = $ReadOnly<{|
  ...Book,
  datePublished?: string,
  publisher: Publisher,
  license: License,
  supportsTranslation: boolean,
  contributors: Array<Contributor>,
  availableLanguages: Array<Language>,
  chapters: Array<ChapterSummary>,
  bookFormat: 'PDF' | 'HTML',
  downloads: {
    epub?: string,
    pdf?: string
  }
|}>;

export type FeaturedContent = $ReadOnly<{|
  title: string,
  description: string,
  link: string,
  imageUrl: string,
  language: Language
|}>;

export type Context = {
  pathname: string,
  asPath: string,
  query: { [string]: string },
  err?: Error | { statusCode: number },
  res?: $Response,
  req?: $Request,
  // The accessToken isn't really part of the context object passed to
  accessToken: string,
  isAuthenticated: boolean
};

export type I18n = {
  t: (Array<string>) => string
};
