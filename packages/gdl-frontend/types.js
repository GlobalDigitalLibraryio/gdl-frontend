// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import type { $Request, $Response } from 'express';
import type { ApolloClient } from 'react-apollo';

export type Publisher = {
  +name: string
};

export type Language = {
  +code: string,
  +name: string,
  +isRTL?: boolean
};

export type ConfigShape = {
  publicRuntimeConfig: {
    bookApiUrl: string,
    canonicalUrl: string,
    siteTranslationServiceUrl: string,
    graphqlEndpoint: string,
    SENTRY_PROJECT_ID: string,
    SENTRY_PUBLIC_KEY: string,
    REPORT_ERRORS: boolean,
    AUTH0: {
      clientId: string,
      audience: string,
      domain: string
    },
    DEFAULT_LANGUAGE: Language,
    googleAnalyticsId: ?string,
    facebookPixelId: ?string,
    zendeskUrl: string
  },
  // Empty object on the client
  serverRuntimeConfig: {
    bookApiUrl?: string,
    siteTranslationServiceUrl?: string
  }
};

// Neat little enum type trick https://github.com/facebook/flow/issues/2377#issuecomment-372613462
export const ContributorTypes: {|
  AUTHOR: 'Author',
  ILLUSTRATOR: 'Illustrator',
  TRANSLATOR: 'Translator',
  PHOTOGRAPHER: 'Photographer',
  CONTRIBUTOR: 'Contributor'
|} = {
  AUTHOR: 'Author',
  ILLUSTRATOR: 'Illustrator',
  TRANSLATOR: 'Translator',
  PHOTOGRAPHER: 'Photographer',
  CONTRIBUTOR: 'Contributor'
};

export type Contributor = {
  +id: number,
  +name: string,
  +type: $Values<typeof ContributorTypes>
};

export type License = {
  +name: string,
  +description: string,
  +url: string
};

export type Chapter = {|
  id: number,
  content: string,
  chapterType: string,
  seqNo: number,
  revision: number,
  images: Array<string>,
  title?: string,
  description?: string
|};

export type ChapterSummary = {|
  id: number,
  seqNo: number,
  url: string
|};

export type FrontPage = {|
  id: number,
  chapterType: 'FrontPage',
  title: string,
  description: string,
  seqNo: number,
  images: Array<string>
|};

// Disjoint union
type Success<T> = { isOk: true, data: T, statusCode: number };
type Failed = { isOk: false, error: any, statusCode: number };
export type RemoteData<T> = Success<T> | Failed;

export type ImageCropCoordinates = {
  x: number,
  height: number,
  y: number,
  width: number,
  ratio: string,
  revision: number
};

export type CoverImage = {
  url: string,
  alttext?: string,
  imageId: string,
  variants?: { [string]: ImageCropCoordinates }
};

export type ReadingLevel = '1' | '2' | '3' | '4' | 'read-aloud' | 'decodable';

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
  readingLevel: ReadingLevel,
  coverImage?: CoverImage
};

export type Category = 'library_books' | 'classroom_books';

export type CrowdinBook = {
  id: number,
  title: string,
  description: string,
  coverImage: {
    url: string,
    imageId: string,
    alttext: string
  },
  chapters: Array<ChapterSummary>
};

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
  coverImage?: CoverImage
|}>;

export type BookDetails = $ReadOnly<{|
  ...Book,
  datePublished?: string,
  publisher: Publisher,
  license: License,
  supportsTranslation: boolean,
  additionalInformation?: string,
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
  apolloClient: ApolloClient
};

export type ChapterContent = $ReadOnly<{ content: string }>;

export type ChapterPointer = $ReadOnly<{
  id: string,
  chapterId: number,
  seqNo: number
}>;

type Messages = {
  [messageId: string]: string | Function
};

export type Catalogs = {
  [language: string]: Messages
};

export type Locale = {
  language: string,
  catalog: Catalogs
};

export type NextRouter = {
  asPath: string,
  back: () => void,
  beforePopState: () => void,
  events: { on: () => void, off: () => void, emit: () => void },
  pathname: string,
  prefetch: () => void,
  push: () => void,
  query: Object,
  reload: () => void,
  replace: () => void,
  route: string
};

/**
 * These type are directly related to the available main route names in routes.js
 * In other words, if a new main category e.g audio, video are added it also needs to be added here
 */
export type MainCategory = 'books' | 'games';
