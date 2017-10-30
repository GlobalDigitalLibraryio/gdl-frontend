// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

export type Publisher = {
  +id: number,
  +name: string,
};

export type Contributor = {
  +id: number,
  +name: string,
};

export type License = {
  +name: string,
  +description: string,
  +url: string,
};

export type Category = {
  +id: number,
  +name: string,
};

export type Language = {
  +code: string,
  +name: string,
};

export type Chapter = {
  content: string,
};

export type ChapterSummary = {
  url: string,
};

export type Failure = {|
  code: string,
  description: string,
  statusCode: number,
  success: false,
|};

export type Success<T> = {|
  data: T,
  success: true,
|};

export type RemoteData<T> = Failure | Success<T>;

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
    pdf: string,
  },
  +coverPhoto?: {
    large: string,
    small: string,
  },
|};
