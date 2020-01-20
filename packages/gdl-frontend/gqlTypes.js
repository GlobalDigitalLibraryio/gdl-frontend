

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: catgoryReadingLevels
// ====================================================

export type catgoryReadingLevels = {
  classroom: Array<ReadingLevel>,
  library: Array<ReadingLevel>,
};

export type catgoryReadingLevelsVariables = {
  language: string
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: languages
// ====================================================

export type languages_languages = {
  __typename: "Language",
  code: string,
  name: string,
};

export type languages = {
  languages: Array<languages_languages>
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OfflineBook
// ====================================================

export type OfflineBook_book_chapters = {
  __typename: "Chapter",
  id: string,
  seqNo: number,
  chapterId: number,
  content: string,
  imageUrls: Array<string>,
};

export type OfflineBook_book_downloads = {
  __typename: "Download",
  epub: ?string,
  pdf: ?string,
};

export type OfflineBook_book_license = {
  __typename: "License",
  url: string,
  name: string,
};

export type OfflineBook_book_language = {
  __typename: "Language",
  code: string,
  name: string,
  isRTL: boolean,
};

export type OfflineBook_book_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type OfflineBook_book_publisher = {
  __typename: "Publisher",
  name: string,
};

export type OfflineBook_book_authors = {
  __typename: "Contributor",
  name: string,
};

export type OfflineBook_book_illustrators = {
  __typename: "Contributor",
  name: string,
};

export type OfflineBook_book_translators = {
  __typename: "Contributor",
  name: string,
};

export type OfflineBook_book_photographers = {
  __typename: "Contributor",
  name: string,
};

export type OfflineBook_book = {
  __typename: "BookDetails",
  id: string,
  bookId: number,
  title: string,
  description: string,
  category: Category,
  readingLevel: ReadingLevel,
  bookFormat: BookFormat,
  supportsTranslation: boolean,
  additionalInformation: ?string,
  chapters: Array<OfflineBook_book_chapters>,
  downloads: OfflineBook_book_downloads,
  license: OfflineBook_book_license,
  language: OfflineBook_book_language,
  coverImage: ?OfflineBook_book_coverImage,
  publisher: OfflineBook_book_publisher,
  authors: ?Array<OfflineBook_book_authors>,
  illustrators: ?Array<OfflineBook_book_illustrators>,
  translators: ?Array<OfflineBook_book_translators>,
  photographers: ?Array<OfflineBook_book_photographers>,
};

export type OfflineBook = {
  book: ?OfflineBook_book
};

export type OfflineBookVariables = {
  id: string
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OfflineBooks
// ====================================================

export type OfflineBooks_books_chapters = {
  __typename: "Chapter",
  id: string,
  seqNo: number,
  chapterId: number,
  content: string,
  imageUrls: Array<string>,
};

export type OfflineBooks_books_downloads = {
  __typename: "Download",
  epub: ?string,
  pdf: ?string,
};

export type OfflineBooks_books_license = {
  __typename: "License",
  url: string,
  name: string,
};

export type OfflineBooks_books_language = {
  __typename: "Language",
  code: string,
  name: string,
  isRTL: boolean,
};

export type OfflineBooks_books_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type OfflineBooks_books_publisher = {
  __typename: "Publisher",
  name: string,
};

export type OfflineBooks_books_authors = {
  __typename: "Contributor",
  name: string,
};

export type OfflineBooks_books_illustrators = {
  __typename: "Contributor",
  name: string,
};

export type OfflineBooks_books_translators = {
  __typename: "Contributor",
  name: string,
};

export type OfflineBooks_books_photographers = {
  __typename: "Contributor",
  name: string,
};

export type OfflineBooks_books = {
  __typename: "BookDetails",
  id: string,
  bookId: number,
  title: string,
  description: string,
  category: Category,
  readingLevel: ReadingLevel,
  bookFormat: BookFormat,
  supportsTranslation: boolean,
  additionalInformation: ?string,
  chapters: Array<OfflineBooks_books_chapters>,
  downloads: OfflineBooks_books_downloads,
  license: OfflineBooks_books_license,
  language: OfflineBooks_books_language,
  coverImage: ?OfflineBooks_books_coverImage,
  publisher: OfflineBooks_books_publisher,
  authors: ?Array<OfflineBooks_books_authors>,
  illustrators: ?Array<OfflineBooks_books_illustrators>,
  translators: ?Array<OfflineBooks_books_translators>,
  photographers: ?Array<OfflineBooks_books_photographers>,
};

export type OfflineBooks = {
  books: Array<?OfflineBooks_books>
};

export type OfflineBooksVariables = {
  ids: Array<string>
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: book
// ====================================================

export type book_book_downloads = {
  __typename: "Download",
  epub: ?string,
  pdf: ?string,
};

export type book_book_license = {
  __typename: "License",
  url: string,
  name: string,
};

export type book_book_language = {
  __typename: "Language",
  code: string,
  name: string,
};

export type book_book_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type book_book_publisher = {
  __typename: "Publisher",
  name: string,
};

export type book_book_authors = {
  __typename: "Contributor",
  name: string,
};

export type book_book_illustrators = {
  __typename: "Contributor",
  name: string,
};

export type book_book_translators = {
  __typename: "Contributor",
  name: string,
};

export type book_book_photographers = {
  __typename: "Contributor",
  name: string,
};

export type book_book = {
  __typename: "BookDetails",
  id: string,
  bookId: number,
  title: string,
  description: string,
  category: Category,
  readingLevel: ReadingLevel,
  bookFormat: BookFormat,
  supportsTranslation: boolean,
  additionalInformation: ?string,
  downloads: book_book_downloads,
  license: book_book_license,
  language: book_book_language,
  coverImage: ?book_book_coverImage,
  publisher: book_book_publisher,
  authors: ?Array<book_book_authors>,
  illustrators: ?Array<book_book_illustrators>,
  translators: ?Array<book_book_translators>,
  photographers: ?Array<book_book_photographers>,
};

export type book = {
  book: ?book_book
};

export type bookVariables = {
  id: string
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: similar
// ====================================================

export type similar_book_similar_results_language = {
  __typename: "Language",
  code: string,
};

export type similar_book_similar_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type similar_book_similar_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  language: similar_book_similar_results_language,
  coverImage: ?similar_book_similar_results_coverImage,
};

export type similar_book_similar = {
  __typename: "ResultItemConnection",
  results: Array<similar_book_similar_results>,
};

export type similar_book = {
  __typename: "BookDetails",
  id: string,
  similar: similar_book_similar,
};

export type similar = {
  book: ?similar_book
};

export type similarVariables = {
  id: string
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReadBook
// ====================================================

export type ReadBook_book_language = {
  __typename: "Language",
  isRTL: boolean,
  code: string,
};

export type ReadBook_book_chapters = {
  __typename: "Chapter",
  id: string,
  seqNo: number,
  chapterId: number,
};

export type ReadBook_book_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type ReadBook_book = {
  __typename: "BookDetails",
  id: string,
  bookId: number,
  title: string,
  description: string,
  language: ReadBook_book_language,
  chapters: Array<ReadBook_book_chapters>,
  coverImage: ?ReadBook_book_coverImage,
};

export type ReadBook = {
  book: ?ReadBook_book
};

export type ReadBookVariables = {
  id: string
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Chapter
// ====================================================

export type Chapter_chapter = {
  __typename: "Chapter",
  id: string,
  seqNo: number,
  chapterId: number,
  content: string,
  imageUrls: Array<string>,
};

export type Chapter = {
  chapter: ?Chapter_chapter
};

export type ChapterVariables = {
  id: string
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CrowdinBook
// ====================================================

export type CrowdinBook_crowdinBook_frontPage = {
  __typename: "FrontPage",
  id: string,
  seqNo: number,
  title: string,
  description: string,
  chapterType: ChapterType,
  images: Array<string>,
};

export type CrowdinBook_crowdinBook_chapters = {
  __typename: "BookChapter",
  id: string,
  seqNo: number,
  url: string,
};

export type CrowdinBook_crowdinBook_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type CrowdinBook_crowdinBook = {
  __typename: "CrowdinBook",
  id: string,
  frontPage: CrowdinBook_crowdinBook_frontPage,
  chapters: Array<CrowdinBook_crowdinBook_chapters>,
  coverImage: ?CrowdinBook_crowdinBook_coverImage,
};

export type CrowdinBook_book_chapters = {
  __typename: "Chapter",
  seqNo: number,
};

export type CrowdinBook_book_language = {
  __typename: "Language",
  code: string,
  isRTL: boolean,
};

export type CrowdinBook_book = {
  __typename: "BookDetails",
  id: string,
  bookId: number,
  title: string,
  description: string,
  chapters: Array<CrowdinBook_book_chapters>,
  language: CrowdinBook_book_language,
};

export type CrowdinBook_translation_to_language = {
  __typename: "Language",
  code: string,
  name: string,
};

export type CrowdinBook_translation_to = {
  __typename: "BookDetails",
  language: CrowdinBook_translation_to_language,
};

export type CrowdinBook_translation = {
  __typename: "Translation",
  to: CrowdinBook_translation_to,
};

export type CrowdinBook_crowdinProjects = {
  __typename: "CrowdinProjects",
  en: string,
};

export type CrowdinBook = {
  crowdinBook: CrowdinBook_crowdinBook,
  book: ?CrowdinBook_book,
  translation: ?CrowdinBook_translation,
  crowdinProjects: CrowdinBook_crowdinProjects,
};

export type CrowdinBookVariables = {
  id: string,
  language: string,
  bookId: string,
  toLanguage: string,
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TranslateBook
// ====================================================

export type TranslateBook_book_publisher = {
  __typename: "Publisher",
  name: string,
};

export type TranslateBook_book_language = {
  __typename: "Language",
  code: string,
  name: string,
};

export type TranslateBook_book_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type TranslateBook_book = {
  __typename: "BookDetails",
  id: string,
  bookId: number,
  title: string,
  description: string,
  publisher: TranslateBook_book_publisher,
  language: TranslateBook_book_language,
  coverImage: ?TranslateBook_book_coverImage,
};

export type TranslateBook_translationLanguages = {
  __typename: "Language",
  code: string,
  name: string,
};

export type TranslateBook = {
  book: ?TranslateBook_book,
  translationLanguages: Array<TranslateBook_translationLanguages>,
};

export type TranslateBookVariables = {
  id: string,
  languageCode: string,
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BrowseBooks
// ====================================================

export type BrowseBooks_bookSummaries_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type BrowseBooks_bookSummaries_results_language = {
  __typename: "Language",
  code: string,
};

export type BrowseBooks_bookSummaries_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?BrowseBooks_bookSummaries_results_coverImage,
  language: BrowseBooks_bookSummaries_results_language,
};

export type BrowseBooks_bookSummaries_pageInfo = {
  __typename: "PageInfo",
  page: number,
  hasNextPage: boolean,
};

export type BrowseBooks_bookSummaries = {
  __typename: "ResultItemConnection",
  results: Array<BrowseBooks_bookSummaries_results>,
  pageInfo: BrowseBooks_bookSummaries_pageInfo,
};

export type BrowseBooks = {
  bookSummaries: BrowseBooks_bookSummaries
};

export type BrowseBooksVariables = {
  language: string,
  readingLevel?: ?ReadingLevel,
  category?: ?Category,
  orderBy?: ?OrderBy,
  pageSize?: ?number,
  page: number,
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyBookTranslations
// ====================================================

export type MyBookTranslations_currentUser_translations_from_language = {
  __typename: "Language",
  name: string,
};

export type MyBookTranslations_currentUser_translations_from = {
  __typename: "BookDetails",
  language: MyBookTranslations_currentUser_translations_from_language,
};

export type MyBookTranslations_currentUser_translations_to_publisher = {
  __typename: "Publisher",
  name: string,
};

export type MyBookTranslations_currentUser_translations_to_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type MyBookTranslations_currentUser_translations_to_language = {
  __typename: "Language",
  name: string,
  code: string,
};

export type MyBookTranslations_currentUser_translations_to = {
  __typename: "BookDetails",
  id: string,
  bookId: number,
  title: string,
  publisher: MyBookTranslations_currentUser_translations_to_publisher,
  coverImage: ?MyBookTranslations_currentUser_translations_to_coverImage,
  language: MyBookTranslations_currentUser_translations_to_language,
};

export type MyBookTranslations_currentUser_translations = {
  __typename: "Translation",
  readingLevel: ReadingLevel,
  crowdinUrl: string,
  synchronizeUrl: string,
  from: MyBookTranslations_currentUser_translations_from,
  to: MyBookTranslations_currentUser_translations_to,
};

export type MyBookTranslations_currentUser = {
  __typename: "User",
  translations: Array<MyBookTranslations_currentUser_translations>,
};

export type MyBookTranslations = {
  currentUser: ?MyBookTranslations_currentUser
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Favorites
// ====================================================

export type Favorites_books_language = {
  __typename: "Language",
  code: string,
};

export type Favorites_books_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type Favorites_books = {
  __typename: "BookDetails",
  id: string,
  bookId: number,
  title: string,
  language: Favorites_books_language,
  coverImage: ?Favorites_books_coverImage,
};

export type Favorites = {
  books: Array<?Favorites_books>
};

export type FavoritesVariables = {
  ids: Array<string>
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: game
// ====================================================

export type game_game_license = {
  __typename: "License",
  url: string,
  name: string,
};

export type game_game_coverImage = {
  __typename: "GameImage",
  imageId: string,
  url: string,
  altText: ?string,
};

export type game_game = {
  __typename: "Game_v2",
  id: string,
  title: string,
  description: string,
  url: string,
  source: string,
  publisher: string,
  license: game_game_license,
  language: string,
  coverImage: game_game_coverImage,
};

export type game = {
  game: ?game_game
};

export type gameVariables = {
  id: string
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckLanguageSupport
// ====================================================

export type CheckLanguageSupport = {
  languageSupport: boolean
};

export type CheckLanguageSupportVariables = {
  language: string
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCategories
// ====================================================

export type GetCategories = {
  categories: Array<Category>
};

export type GetCategoriesVariables = {
  language: string
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HomeContent
// ====================================================

export type HomeContent_featuredContent_language = {
  __typename: "Language",
  code: string,
};

export type HomeContent_featuredContent = {
  __typename: "FeaturedContent",
  id: string,
  title: string,
  description: string,
  link: string,
  imageUrl: string,
  language: HomeContent_featuredContent_language,
};

export type HomeContent_Decodable_pageInfo = {
  __typename: "PageInfo",
  page: number,
  pageSize: number,
  pageCount: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type HomeContent_Decodable_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type HomeContent_Decodable_results_language = {
  __typename: "Language",
  code: string,
};

export type HomeContent_Decodable_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?HomeContent_Decodable_results_coverImage,
  language: HomeContent_Decodable_results_language,
};

export type HomeContent_Decodable = {
  __typename: "ResultItemConnection",
  pageInfo: HomeContent_Decodable_pageInfo,
  results: Array<HomeContent_Decodable_results>,
};

export type HomeContent_Level1_pageInfo = {
  __typename: "PageInfo",
  page: number,
  pageSize: number,
  pageCount: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type HomeContent_Level1_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type HomeContent_Level1_results_language = {
  __typename: "Language",
  code: string,
};

export type HomeContent_Level1_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?HomeContent_Level1_results_coverImage,
  language: HomeContent_Level1_results_language,
};

export type HomeContent_Level1 = {
  __typename: "ResultItemConnection",
  pageInfo: HomeContent_Level1_pageInfo,
  results: Array<HomeContent_Level1_results>,
};

export type HomeContent_Level2_pageInfo = {
  __typename: "PageInfo",
  page: number,
  pageSize: number,
  pageCount: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type HomeContent_Level2_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type HomeContent_Level2_results_language = {
  __typename: "Language",
  code: string,
};

export type HomeContent_Level2_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?HomeContent_Level2_results_coverImage,
  language: HomeContent_Level2_results_language,
};

export type HomeContent_Level2 = {
  __typename: "ResultItemConnection",
  pageInfo: HomeContent_Level2_pageInfo,
  results: Array<HomeContent_Level2_results>,
};

export type HomeContent_Level3_pageInfo = {
  __typename: "PageInfo",
  page: number,
  pageSize: number,
  pageCount: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type HomeContent_Level3_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type HomeContent_Level3_results_language = {
  __typename: "Language",
  code: string,
};

export type HomeContent_Level3_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?HomeContent_Level3_results_coverImage,
  language: HomeContent_Level3_results_language,
};

export type HomeContent_Level3 = {
  __typename: "ResultItemConnection",
  pageInfo: HomeContent_Level3_pageInfo,
  results: Array<HomeContent_Level3_results>,
};

export type HomeContent_Level4_pageInfo = {
  __typename: "PageInfo",
  page: number,
  pageSize: number,
  pageCount: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type HomeContent_Level4_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type HomeContent_Level4_results_language = {
  __typename: "Language",
  code: string,
};

export type HomeContent_Level4_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?HomeContent_Level4_results_coverImage,
  language: HomeContent_Level4_results_language,
};

export type HomeContent_Level4 = {
  __typename: "ResultItemConnection",
  pageInfo: HomeContent_Level4_pageInfo,
  results: Array<HomeContent_Level4_results>,
};

export type HomeContent_Level5_pageInfo = {
  __typename: "PageInfo",
  page: number,
  pageSize: number,
  pageCount: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type HomeContent_Level5_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type HomeContent_Level5_results_language = {
  __typename: "Language",
  code: string,
};

export type HomeContent_Level5_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?HomeContent_Level5_results_coverImage,
  language: HomeContent_Level5_results_language,
};

export type HomeContent_Level5 = {
  __typename: "ResultItemConnection",
  pageInfo: HomeContent_Level5_pageInfo,
  results: Array<HomeContent_Level5_results>,
};

export type HomeContent_Level6_pageInfo = {
  __typename: "PageInfo",
  page: number,
  pageSize: number,
  pageCount: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type HomeContent_Level6_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type HomeContent_Level6_results_language = {
  __typename: "Language",
  code: string,
};

export type HomeContent_Level6_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?HomeContent_Level6_results_coverImage,
  language: HomeContent_Level6_results_language,
};

export type HomeContent_Level6 = {
  __typename: "ResultItemConnection",
  pageInfo: HomeContent_Level6_pageInfo,
  results: Array<HomeContent_Level6_results>,
};

export type HomeContent_ReadAloud_pageInfo = {
  __typename: "PageInfo",
  page: number,
  pageSize: number,
  pageCount: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type HomeContent_ReadAloud_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type HomeContent_ReadAloud_results_language = {
  __typename: "Language",
  code: string,
};

export type HomeContent_ReadAloud_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?HomeContent_ReadAloud_results_coverImage,
  language: HomeContent_ReadAloud_results_language,
};

export type HomeContent_ReadAloud = {
  __typename: "ResultItemConnection",
  pageInfo: HomeContent_ReadAloud_pageInfo,
  results: Array<HomeContent_ReadAloud_results>,
};

export type HomeContent = {
  featuredContent: Array<HomeContent_featuredContent>,
  Decodable: HomeContent_Decodable,
  Level1: HomeContent_Level1,
  Level2: HomeContent_Level2,
  Level3: HomeContent_Level3,
  Level4: HomeContent_Level4,
  Level5: HomeContent_Level5,
  Level6: HomeContent_Level6,
  ReadAloud: HomeContent_ReadAloud,
};

export type HomeContentVariables = {
  language: string,
  category: Category,
  pageSize?: ?number,
  page?: ?number,
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Search
// ====================================================

export type Search_search_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type Search_search_results_language = {
  __typename: "Language",
  code: string,
  name: string,
};

export type Search_search_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  highlightTitle: ?string,
  description: string,
  highlightDescription: ?string,
  readingLevel: ReadingLevel,
  coverImage: ?Search_search_results_coverImage,
  language: Search_search_results_language,
};

export type Search_search_pageInfo = {
  __typename: "PageInfo",
  page: number,
  hasNextPage: boolean,
};

export type Search_search = {
  __typename: "ResultItemConnection",
  results: Array<Search_search_results>,
  totalCount: number,
  pageInfo: Search_search_pageInfo,
};

export type Search = {
  search: Search_search
};

export type SearchVariables = {
  query: string,
  pageSize?: ?number,
  page: number,
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OfflinedBook
// ====================================================

export type OfflinedBook_chapters = {
  __typename: "Chapter",
  id: string,
  seqNo: number,
  chapterId: number,
  content: string,
  imageUrls: Array<string>,
};

export type OfflinedBook_downloads = {
  __typename: "Download",
  epub: ?string,
  pdf: ?string,
};

export type OfflinedBook_license = {
  __typename: "License",
  url: string,
  name: string,
};

export type OfflinedBook_language = {
  __typename: "Language",
  code: string,
  name: string,
  isRTL: boolean,
};

export type OfflinedBook_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type OfflinedBook_publisher = {
  __typename: "Publisher",
  name: string,
};

export type OfflinedBook_authors = {
  __typename: "Contributor",
  name: string,
};

export type OfflinedBook_illustrators = {
  __typename: "Contributor",
  name: string,
};

export type OfflinedBook_translators = {
  __typename: "Contributor",
  name: string,
};

export type OfflinedBook_photographers = {
  __typename: "Contributor",
  name: string,
};

export type OfflinedBook = {
  __typename: "BookDetails",
  id: string,
  bookId: number,
  title: string,
  description: string,
  category: Category,
  readingLevel: ReadingLevel,
  bookFormat: BookFormat,
  supportsTranslation: boolean,
  additionalInformation: ?string,
  chapters: Array<OfflinedBook_chapters>,
  downloads: OfflinedBook_downloads,
  license: OfflinedBook_license,
  language: OfflinedBook_language,
  coverImage: ?OfflinedBook_coverImage,
  publisher: OfflinedBook_publisher,
  authors: ?Array<OfflinedBook_authors>,
  illustrators: ?Array<OfflinedBook_illustrators>,
  translators: ?Array<OfflinedBook_translators>,
  photographers: ?Array<OfflinedBook_photographers>,
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: fields
// ====================================================

export type fields_pageInfo = {
  __typename: "PageInfo",
  page: number,
  pageSize: number,
  pageCount: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type fields_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type fields_results_language = {
  __typename: "Language",
  code: string,
};

export type fields_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?fields_results_coverImage,
  language: fields_results_language,
};

export type fields = {
  __typename: "ResultItemConnection",
  pageInfo: fields_pageInfo,
  results: Array<fields_results>,
};

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * 
 */
export type ReadingLevel = "Decodable" | "Decodable1" | "Decodable10" | "Decodable11" | "Decodable12" | "Decodable2" | "Decodable3" | "Decodable4" | "Decodable5" | "Decodable6" | "Decodable7" | "Decodable8" | "Decodable9" | "Level1" | "Level2" | "Level3" | "Level4" | "Level5" | "Level6" | "ReadAloud";

/**
 * 
 */
export type Category = "Classroom" | "Library";

/**
 * 
 */
export type BookFormat = "HTML" | "PDF";

/**
 * 
 */
export type ChapterType = "Content" | "FrontPage";

/**
 * 
 */
export type OrderBy = "arrivalDate_ASC" | "arrivalDate_DESC" | "title_ASC" | "title_DESC";

//==============================================================
// END Enums and Input Objects
//==============================================================