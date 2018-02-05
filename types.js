// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import type { $Request, $Response } from 'express';

export type Publisher = {
  +name: string
};

export type Contributor = {
  +id: number,
  +name: string,
  +type:
    | 'Author'
    | 'Illustrator'
    | 'Translator'
    | 'Photographer'
    | 'Contributor'
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

// Disjoint union
type Success<T> = { isOk: true, data: T, statusCode: number };
type Failed = { isOk: false, error: any, statusCode: number };
export type RemoteData<T> = Success<T> | Failed;

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

export type Category = 'library_books' | 'classroom_books';

export type ReadingLevel = '1' | '2' | '3' | '4' | 'read-aloud' | 'decodable';

export type Book = $ReadOnly<{|
  id: number,
  uuid: string,
  title: string,
  description: string,
  category: Category,
  highlightTitle?: string,
  highlightDescription?: string,
  readingLevel: ReadingLevel,
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
  req?: $Request
};

export type I18n = {
  t: (Array<string>) => string
};
