/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: catgoryReadingLevels
// ====================================================

export type catgoryReadingLevels = {
  classroom: Array<ReadingLevel>,
  library: Array<ReadingLevel>
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
  __typename: 'Language',
  code: string,
  name: string
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
  __typename: 'Chapter',
  id: string,
  seqNo: number,
  chapterId: number,
  content: string,
  imageUrls: Array<string>
};

export type OfflineBook_book_downloads = {
  __typename: 'Download',
  epub: ?string,
  pdf: ?string
};

export type OfflineBook_book_license = {
  __typename: 'License',
  url: string,
  name: string
};

export type OfflineBook_book_language = {
  __typename: 'Language',
  code: string,
  name: string,
  isRTL: boolean
};

export type OfflineBook_book_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type OfflineBook_book_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<OfflineBook_book_coverImage_variants>
};

export type OfflineBook_book_publisher = {
  __typename: 'Publisher',
  name: string
};

export type OfflineBook_book_authors = {
  __typename: 'Contributor',
  name: string
};

export type OfflineBook_book_illustrators = {
  __typename: 'Contributor',
  name: string
};

export type OfflineBook_book_translators = {
  __typename: 'Contributor',
  name: string
};

export type OfflineBook_book_photographers = {
  __typename: 'Contributor',
  name: string
};

export type OfflineBook_book = {
  __typename: 'BookDetails',
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
  photographers: ?Array<OfflineBook_book_photographers>
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
// GraphQL query operation: book
// ====================================================

export type book_book_downloads = {
  __typename: 'Download',
  epub: ?string,
  pdf: ?string
};

export type book_book_license = {
  __typename: 'License',
  url: string,
  name: string
};

export type book_book_language = {
  __typename: 'Language',
  code: string,
  name: string
};

export type book_book_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type book_book_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<book_book_coverImage_variants>
};

export type book_book_publisher = {
  __typename: 'Publisher',
  name: string
};

export type book_book_authors = {
  __typename: 'Contributor',
  name: string
};

export type book_book_illustrators = {
  __typename: 'Contributor',
  name: string
};

export type book_book_translators = {
  __typename: 'Contributor',
  name: string
};

export type book_book_photographers = {
  __typename: 'Contributor',
  name: string
};

export type book_book = {
  __typename: 'BookDetails',
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
  photographers: ?Array<book_book_photographers>
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
  __typename: 'Language',
  code: string
};

export type similar_book_similar_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type similar_book_similar_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<similar_book_similar_results_coverImage_variants>
};

export type similar_book_similar_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  language: similar_book_similar_results_language,
  coverImage: ?similar_book_similar_results_coverImage
};

export type similar_book_similar = {
  __typename: 'ResultItemConnection',
  results: Array<similar_book_similar_results>
};

export type similar_book = {
  __typename: 'BookDetails',
  id: string,
  similar: similar_book_similar
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
  __typename: 'Language',
  isRTL: boolean,
  code: string
};

export type ReadBook_book_chapters = {
  __typename: 'Chapter',
  id: string,
  seqNo: number,
  chapterId: number
};

export type ReadBook_book_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type ReadBook_book_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<ReadBook_book_coverImage_variants>
};

export type ReadBook_book = {
  __typename: 'BookDetails',
  id: string,
  bookId: number,
  title: string,
  description: string,
  language: ReadBook_book_language,
  chapters: Array<ReadBook_book_chapters>,
  coverImage: ?ReadBook_book_coverImage
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
  __typename: 'Chapter',
  id: string,
  seqNo: number,
  chapterId: number,
  content: string,
  imageUrls: Array<string>
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
// GraphQL query operation: TranslateBook
// ====================================================

export type TranslateBook_book_publisher = {
  __typename: 'Publisher',
  name: string
};

export type TranslateBook_book_language = {
  __typename: 'Language',
  code: string,
  name: string
};

export type TranslateBook_book_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type TranslateBook_book_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<TranslateBook_book_coverImage_variants>
};

export type TranslateBook_book = {
  __typename: 'BookDetails',
  id: string,
  bookId: number,
  title: string,
  description: string,
  publisher: TranslateBook_book_publisher,
  language: TranslateBook_book_language,
  coverImage: ?TranslateBook_book_coverImage
};

export type TranslateBook_translationLanguages = {
  __typename: 'Language',
  code: string,
  name: string
};

export type TranslateBook = {
  book: ?TranslateBook_book,
  translationLanguages: Array<TranslateBook_translationLanguages>
};

export type TranslateBookVariables = {
  id: string,
  languageCode: string
};

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BrowseBooks
// ====================================================

export type BrowseBooks_bookSummaries_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type BrowseBooks_bookSummaries_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<BrowseBooks_bookSummaries_results_coverImage_variants>
};

export type BrowseBooks_bookSummaries_results_language = {
  __typename: 'Language',
  code: string
};

export type BrowseBooks_bookSummaries_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  coverImage: ?BrowseBooks_bookSummaries_results_coverImage,
  language: BrowseBooks_bookSummaries_results_language
};

export type BrowseBooks_bookSummaries_pageInfo = {
  __typename: 'PageInfo',
  page: number,
  hasNextPage: boolean
};

export type BrowseBooks_bookSummaries = {
  __typename: 'ResultItemConnection',
  results: Array<BrowseBooks_bookSummaries_results>,
  pageInfo: BrowseBooks_bookSummaries_pageInfo
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
  page: number
};

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyBookTranslations
// ====================================================

export type MyBookTranslations_currentUser_translations_from_language = {
  __typename: 'Language',
  name: string
};

export type MyBookTranslations_currentUser_translations_from = {
  __typename: 'BookDetails',
  language: MyBookTranslations_currentUser_translations_from_language
};

export type MyBookTranslations_currentUser_translations_to_publisher = {
  __typename: 'Publisher',
  name: string
};

export type MyBookTranslations_currentUser_translations_to_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type MyBookTranslations_currentUser_translations_to_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<MyBookTranslations_currentUser_translations_to_coverImage_variants>
};

export type MyBookTranslations_currentUser_translations_to_language = {
  __typename: 'Language',
  name: string,
  code: string
};

export type MyBookTranslations_currentUser_translations_to = {
  __typename: 'BookDetails',
  bookId: number,
  title: string,
  publisher: MyBookTranslations_currentUser_translations_to_publisher,
  coverImage: ?MyBookTranslations_currentUser_translations_to_coverImage,
  language: MyBookTranslations_currentUser_translations_to_language
};

export type MyBookTranslations_currentUser_translations = {
  __typename: 'Translation',
  crowdinUrl: string,
  synchronizeUrl: string,
  from: MyBookTranslations_currentUser_translations_from,
  to: MyBookTranslations_currentUser_translations_to
};

export type MyBookTranslations_currentUser = {
  __typename: 'User',
  translations: Array<MyBookTranslations_currentUser_translations>
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
  __typename: 'Language',
  code: string
};

export type Favorites_books_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type Favorites_books_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<Favorites_books_coverImage_variants>
};

export type Favorites_books = {
  __typename: 'BookDetails',
  id: string,
  bookId: number,
  title: string,
  language: Favorites_books_language,
  coverImage: ?Favorites_books_coverImage
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
// GraphQL query operation: books
// ====================================================

export type books_Decodable_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type books_Decodable_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<books_Decodable_results_coverImage_variants>
};

export type books_Decodable_results_language = {
  __typename: 'Language',
  code: string
};

export type books_Decodable_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Decodable_results_coverImage,
  language: books_Decodable_results_language
};

export type books_Decodable = {
  __typename: 'ResultItemConnection',
  results: Array<books_Decodable_results>
};

export type books_Level1_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type books_Level1_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<books_Level1_results_coverImage_variants>
};

export type books_Level1_results_language = {
  __typename: 'Language',
  code: string
};

export type books_Level1_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Level1_results_coverImage,
  language: books_Level1_results_language
};

export type books_Level1 = {
  __typename: 'ResultItemConnection',
  results: Array<books_Level1_results>
};

export type books_Level2_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type books_Level2_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<books_Level2_results_coverImage_variants>
};

export type books_Level2_results_language = {
  __typename: 'Language',
  code: string
};

export type books_Level2_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Level2_results_coverImage,
  language: books_Level2_results_language
};

export type books_Level2 = {
  __typename: 'ResultItemConnection',
  results: Array<books_Level2_results>
};

export type books_Level3_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type books_Level3_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<books_Level3_results_coverImage_variants>
};

export type books_Level3_results_language = {
  __typename: 'Language',
  code: string
};

export type books_Level3_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Level3_results_coverImage,
  language: books_Level3_results_language
};

export type books_Level3 = {
  __typename: 'ResultItemConnection',
  results: Array<books_Level3_results>
};

export type books_Level4_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type books_Level4_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<books_Level4_results_coverImage_variants>
};

export type books_Level4_results_language = {
  __typename: 'Language',
  code: string
};

export type books_Level4_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Level4_results_coverImage,
  language: books_Level4_results_language
};

export type books_Level4 = {
  __typename: 'ResultItemConnection',
  results: Array<books_Level4_results>
};

export type books_ReadAloud_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type books_ReadAloud_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<books_ReadAloud_results_coverImage_variants>
};

export type books_ReadAloud_results_language = {
  __typename: 'Language',
  code: string
};

export type books_ReadAloud_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_ReadAloud_results_coverImage,
  language: books_ReadAloud_results_language
};

export type books_ReadAloud = {
  __typename: 'ResultItemConnection',
  results: Array<books_ReadAloud_results>
};

export type books_NewArrivals_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type books_NewArrivals_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<books_NewArrivals_results_coverImage_variants>
};

export type books_NewArrivals_results_language = {
  __typename: 'Language',
  code: string
};

export type books_NewArrivals_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_NewArrivals_results_coverImage,
  language: books_NewArrivals_results_language
};

export type books_NewArrivals = {
  __typename: 'ResultItemConnection',
  results: Array<books_NewArrivals_results>
};

export type books = {
  Decodable: books_Decodable,
  Level1: books_Level1,
  Level2: books_Level2,
  Level3: books_Level3,
  Level4: books_Level4,
  ReadAloud: books_ReadAloud,
  NewArrivals: books_NewArrivals
};

export type booksVariables = {
  language: string,
  pageSize?: ?number
};

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Search
// ====================================================

export type Search_search_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type Search_search_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<Search_search_results_coverImage_variants>
};

export type Search_search_results_language = {
  __typename: 'Language',
  code: string,
  name: string
};

export type Search_search_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  highlightTitle: ?string,
  description: string,
  highlightDescription: ?string,
  readingLevel: ReadingLevel,
  coverImage: ?Search_search_results_coverImage,
  language: Search_search_results_language
};

export type Search_search_pageInfo = {
  __typename: 'PageInfo',
  page: number,
  hasNextPage: boolean
};

export type Search_search = {
  __typename: 'ResultItemConnection',
  results: Array<Search_search_results>,
  totalCount: number,
  pageInfo: Search_search_pageInfo
};

export type Search = {
  search: Search_search
};

export type SearchVariables = {
  query: string,
  pageSize?: ?number,
  page: number
};

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: fields
// ====================================================

export type fields_results_coverImage_variants = {
  __typename: 'ImageCropCoordinates',
  height: number,
  width: number,
  x: number,
  y: number,
  ratio: string
};

export type fields_results_coverImage = {
  __typename: 'CoverImage',
  url: string,
  variants: ?Array<fields_results_coverImage_variants>
};

export type fields_results_language = {
  __typename: 'Language',
  code: string
};

export type fields_results = {
  __typename: 'BookSummary',
  id: string,
  bookId: number,
  title: string,
  coverImage: ?fields_results_coverImage,
  language: fields_results_language
};

export type fields = {
  __typename: 'ResultItemConnection',
  results: Array<fields_results>
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
export type ReadingLevel =
  | 'Decodable'
  | 'Level1'
  | 'Level2'
  | 'Level3'
  | 'Level4'
  | 'ReadAloud';

/**
 *
 */
export type Category = 'Classroom' | 'Library';

/**
 *
 */
export type BookFormat = 'HTML' | 'PDF';

/**
 *
 */
export type OrderBy =
  | 'arrivalDate_ASC'
  | 'arrivalDate_DESC'
  | 'title_ASC'
  | 'title_DESC';

//==============================================================
// END Enums and Input Objects
//==============================================================
