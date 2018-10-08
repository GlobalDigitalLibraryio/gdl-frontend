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
  +license: string,
  +description: string,
  +url: string
};

export type Language = {
  +code: string,
  +name: string
};

export type Chapter = {|
  id: number,
  content: string,
  seqNo: number
|};

export type ChapterSummary = {|
  id: number,
  seqNo: number
|};

// Disjoint union
type Success<T> = { isOk: true, data: T, statusCode: number };
type Failed = { isOk: false, error: any, statusCode: number };
export type RemoteData<T> = Success<T> | Failed;

export type CoverImageInfo = {
  url: string,
  alttext?: string,
  imageId: string
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
  coverImage?: CoverImageInfo
};

export type Category = 'library_books' | 'classroom_books';

export type ReadingLevel = '1' | '2' | '3' | '4' | 'read-aloud' | 'decodable';

export type PublishingStatus = 'PUBLISHED' | 'FLAGGED' | 'UNLISTED';

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
  coverImage?: CoverImageInfo
|}>;

export type BookDetails = $ReadOnly<{|
  ...Book,
  publishingStatus: PublishingStatus,
  datePublished?: string,
  publisher: Publisher,
  license: License,
  coverImage: CoverImageInfo,
  additionalInformation?: string,
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

export type ImageCropCoordinates = {
  topLeftX: number,
  height: number,
  topLeftY: number,
  width: number,
  ratio: string,
  revision: number
};

export type FeaturedContent = $ReadOnly<{
  id: number,
  title: string,
  description: string,
  link: string,
  imageUrl: string,
  language: Language
}>;

export type Context = {
  pathname: string,
  asPath: string,
  query: { [string]: string },
  err?: Error | { statusCode: number },
  res?: $Response,
  req?: $Request
};

export type Copyright = {
  license: License,
  origin: string,
  creators: [],
  processors: [],
  rightsholders: []
};

export type NewImageMetadata = {
  externalId: string,
  title: string,
  alttext: string,
  copyright: Copyright,
  tags: [],
  caption: string,
  language: string
};

export type ImageMetadata = {
  id: string,
  externalId: string,
  metaUrl: string,
  title: {
    title: string,
    language: string
  },
  alttext: {
    alttext: string,
    language: string
  },
  imageUrl: string,
  size: number,
  contentType: string,
  copyright: Copyright,
  tags: {
    tags: [string],
    language: string
  },
  caption: {
    caption: string,
    language: string
  },
  supportedLanguages: [string]
};
