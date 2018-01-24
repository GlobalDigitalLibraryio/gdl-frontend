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

export type Category = {
  +id: number,
  +name: string
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

export type Translation = {
  bookId: number,
  crowdinUrl: string
};

export type Book = {|
  +id: number,
  +title: string,
  +description: string,
  +datePublished?: string, // Optional
  +publisher: Publisher,
  +license: License,
  +readingLevel: string,
  +categories: Array<Category>,
  +contributors: Array<Contributor>,
  +language: Language,
  +availableLanguages: Array<Language>,
  +chapters: Array<ChapterSummary>,
  +downloads: {
    epub: string,
    pdf: string
  },
  +coverPhoto?: {
    large: string,
    small: string
  }
|};

export type FeaturedContent = {|
  +title: string,
  +description: string,
  +link: string,
  +imageUrl: string
|};

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
