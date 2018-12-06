

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
// GraphQL query operation: book
// ====================================================

export type book_book_similar_results_language = {
  __typename: "Language",
  code: string,
};

export type book_book_similar_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type book_book_similar_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  language: book_book_similar_results_language,
  coverImage: ?book_book_similar_results_coverImage,
};

export type book_book_similar = {
  __typename: "ResultItemConnection",
  results: Array<book_book_similar_results>,
};

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
  altText: ?string,
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
  similar: book_book_similar,
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
// GraphQL query operation: books
// ====================================================

export type books_Decodable_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type books_Decodable_results_language = {
  __typename: "Language",
  code: string,
};

export type books_Decodable_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Decodable_results_coverImage,
  language: books_Decodable_results_language,
};

export type books_Decodable = {
  __typename: "ResultItemConnection",
  results: Array<books_Decodable_results>,
};

export type books_Level1_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type books_Level1_results_language = {
  __typename: "Language",
  code: string,
};

export type books_Level1_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Level1_results_coverImage,
  language: books_Level1_results_language,
};

export type books_Level1 = {
  __typename: "ResultItemConnection",
  results: Array<books_Level1_results>,
};

export type books_Level2_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type books_Level2_results_language = {
  __typename: "Language",
  code: string,
};

export type books_Level2_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Level2_results_coverImage,
  language: books_Level2_results_language,
};

export type books_Level2 = {
  __typename: "ResultItemConnection",
  results: Array<books_Level2_results>,
};

export type books_Level3_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type books_Level3_results_language = {
  __typename: "Language",
  code: string,
};

export type books_Level3_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Level3_results_coverImage,
  language: books_Level3_results_language,
};

export type books_Level3 = {
  __typename: "ResultItemConnection",
  results: Array<books_Level3_results>,
};

export type books_Level4_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type books_Level4_results_language = {
  __typename: "Language",
  code: string,
};

export type books_Level4_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_Level4_results_coverImage,
  language: books_Level4_results_language,
};

export type books_Level4 = {
  __typename: "ResultItemConnection",
  results: Array<books_Level4_results>,
};

export type books_ReadAloud_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type books_ReadAloud_results_language = {
  __typename: "Language",
  code: string,
};

export type books_ReadAloud_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_ReadAloud_results_coverImage,
  language: books_ReadAloud_results_language,
};

export type books_ReadAloud = {
  __typename: "ResultItemConnection",
  results: Array<books_ReadAloud_results>,
};

export type books_NewArrivals_results_coverImage = {
  __typename: "CoverImage",
  url: string,
};

export type books_NewArrivals_results_language = {
  __typename: "Language",
  code: string,
};

export type books_NewArrivals_results = {
  __typename: "BookSummary",
  id: string,
  bookId: number,
  title: string,
  coverImage: ?books_NewArrivals_results_coverImage,
  language: books_NewArrivals_results_language,
};

export type books_NewArrivals = {
  __typename: "ResultItemConnection",
  results: Array<books_NewArrivals_results>,
};

export type books = {
  Decodable: books_Decodable,
  Level1: books_Level1,
  Level2: books_Level2,
  Level3: books_Level3,
  Level4: books_Level4,
  ReadAloud: books_ReadAloud,
  NewArrivals: books_NewArrivals,
};

export type booksVariables = {
  language: string,
  pageSize?: ?number,
};


/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: fields
// ====================================================

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
export type ReadingLevel = "Decodable" | "Level1" | "Level2" | "Level3" | "Level4" | "ReadAloud";

/**
 * 
 */
export type Category = "Classroom" | "Library";

/**
 * 
 */
export type BookFormat = "HTML" | "PDF";

//==============================================================
// END Enums and Input Objects
//==============================================================