// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import gql from 'graphql-tag';

import { Router } from '../../routes';
import Reader from '../../components/Reader';
import doFetch from '../../fetch';
import type {
  ConfigShape,
  Context,
  ChapterContent,
  ChapterPointer
} from '../../types';

import type {
  CrowdinBook_book as Book,
  CrowdinBook_translation as Translation,
  CrowdinBook_crowdinBook_frontPage as FrontPage,
  CrowdinBook_crowdinBook_chapters as Chapter
} from '../../gqlTypes';

import { withErrorPage } from '../../hocs';

const {
  publicRuntimeConfig: { canonicalUrl }
}: ConfigShape = getConfig();

const isBrowser = typeof window !== 'undefined';

// In-context requires that jipt is defined before the crowdin script is initialized
if (isBrowser) {
  window._jipt = [];
}

const CROWDIN_BOOK_QUERY = gql`
  query CrowdinBook(
    $id: ID!
    $language: String!
    $bookId: ID!
    $toLanguage: String!
  ) {
    crowdinBook(id: $id, language: $language) {
      id
      frontPage {
        id
        seqNo
        title
        description
        chapterType
        images
      }
      chapters {
        id
        seqNo
        url
      }
      coverImage {
        url
      }
    }
    book(id: $bookId) {
      id
      bookId
      title
      description
      chapters {
        seqNo
      }
      language {
        code
        isRTL
      }
    }
    translation(id: $id, toLanguage: $toLanguage) {
      to {
        language {
          code
          name
        }
      }
    }
    crowdinProjects {
      en
    }
  }
`;

type Props = {
  book: Book,
  translation: Translation,
  frontPage: FrontPage,
  initialChapter: FrontPage | Chapter,
  crowdinProjects: { [key: string]: string },
  crowdinChapters: Array<ChapterPointer>,
  showCanonicalChapterUrl: boolean
};

type State = {
  chapters: { [string]: FrontPage | ChapterContent },
  current: ChapterPointer
};

/**
 * The logic for in-context translation can be complex so here is a description:
 *
 * 1) Fetch all necessary data from GraphQL.
 * 2) If chapterId is specified in query, fetch specified or fetch first chapter.
 * 3) Initialize custom frontpage and set pointer for current chapter. Default to frontPage.
 * 4) Load next and prev chapter with current pointer, if it hasnt been loaded already. This is to preload chapters.
 * 5) Set in-context params.
 */

class TranslateEditPage extends React.Component<Props, State> {
  static async getInitialProps({ query, req, apolloClient }: Context) {
    if (!query.id || !query.lang || !query.toLang) return { statusCode: 404 };

    const crowdinRes = await apolloClient.query({
      query: CROWDIN_BOOK_QUERY,
      variables: {
        id: query.id,
        language: query.lang,
        toLanguage: query.toLang,
        bookId: `${query.id}-${query.lang}`
      }
    });
    const { book, translation, crowdinBook, crowdinProjects } = crowdinRes.data;
    // translation is optional in case invalid language
    if (!translation) return { statusCode: 404 };

    let initialChapter;

    if (query.chapterId) {
      const chapterInfo = crowdinBook.chapters.find(
        chapter => chapter.id.toString() === query.chapterId
      );

      // If no chapterInfo, it means the chapterId is invalid and we prompt 404 page
      if (!chapterInfo) return { statusCode: 404 };
      initialChapter = await doFetch(chapterInfo.url);
    } else {
      initialChapter = await doFetch(crowdinBook.chapters[0].url);
    }
    if (initialChapter && !initialChapter.isOk)
      return { statusCode: initialChapter.statusCode };

    return {
      book,
      translation,
      frontPage: crowdinBook.frontPage,
      initialChapter: initialChapter.data,
      crowdinProjects,
      crowdinChapters: [crowdinBook.frontPage, ...crowdinBook.chapters],
      showCanonicalChapterUrl: !query.chapterId
    };
  }

  state = {
    chapters: {
      [this.props.frontPage.id]: this.props.frontPage,
      [this.props.initialChapter.id]: this.props.initialChapter
    },
    // To decide initial page, check if query.chapterId exist to bother finding pointer to correct chapter.
    current: this.props.showCanonicalChapterUrl
      ? this.props.crowdinChapters[0]
      : this.props.crowdinChapters.find(
          v => v.id === this.props.initialChapter.id.toString()
        ) || this.props.crowdinChapters[0]
  };

  componentDidMount() {
    const { book, translation, crowdinProjects } = this.props;

    const next = this.getNext();
    if (next) {
      this.loadChapter(next.id);
    }

    const prev = this.getPrevious();
    if (prev) {
      this.loadChapter(prev.id);
    }

    window.localStorage.clear();
    initInContext(book.id, crowdinProjects.en, translation);
  }

  getNext(): ChapterPointer {
    const { crowdinChapters } = this.props;
    const indexOfCurrent = crowdinChapters.indexOf(this.state.current);
    return crowdinChapters[indexOfCurrent + 1];
  }

  getPrevious(): ChapterPointer {
    const { crowdinChapters } = this.props;
    const indexOfCurrent = crowdinChapters.indexOf(this.state.current);
    return crowdinChapters[indexOfCurrent - 1];
  }

  async loadChapter(chapterId: string) {
    // Make sure we haven't loaded the chapter already
    if (this.state.chapters && this.state.chapters[chapterId]) return;

    const chapterInfo = this.props.crowdinChapters.find(
      chapter => chapter.id === chapterId
    );

    // $FlowFixMe chapterInfo is either Chapter or FrontPage, but FrontPage doesnt have url and is initially loaded so it stops at the return statement above
    const result = await doFetch(chapterInfo.url);

    // TODO: Notify user of error
    if (!result.isOk) {
      return;
    }

    const chapter = result.data;
    preloadImages(chapter.images);

    this.setState(state => ({
      chapters: { ...state.chapters, [chapter.id]: chapter }
    }));
  }

  handleNextChapter = () => {
    removeInContextBadge();
    const next = this.getNext();
    if (next) {
      this.loadChapter(next.id);
      this.setState({ current: next }, () => {
        // Change the URL, and start preloading
        this.changeChapterInUrl();
        const newNext = this.getNext();
        newNext && this.loadChapter(newNext.id);
      });
    }
  };

  handlePreviousChapter = () => {
    removeInContextBadge();
    const prev = this.getPrevious();
    if (prev) {
      this.loadChapter(prev.id);
      this.setState({ current: prev }, () => {
        // Change the URL, and start preloading
        this.changeChapterInUrl();
        const newPrev = this.getPrevious();
        newPrev && this.loadChapter(newPrev.id);
      });
    }
  };

  // Using window navigation to be able to kill crowdin in-context script
  handleCloseBook = () => {
    window.localStorage.clear();
    window.location.href = `/books/translations`;
  };

  changeChapterInUrl = () =>
    Router.replaceRoute(
      'translateEdit',
      {
        id: this.props.book.bookId,
        lang: this.props.book.language.code,
        toLang: this.props.translation.to.language.code,
        // FrontPage is custom made and have been given id 0, which should not be appended in url.
        chapterId:
          this.state.current && !!this.state.current.id
            ? this.state.current.id
            : null
      },
      { shallow: true }
    );

  render() {
    const { book, crowdinChapters, showCanonicalChapterUrl } = this.props;
    const { current, chapters } = this.state;
    const next = this.getNext();
    const prev = this.getPrevious();

    return (
      <>
        <Head
          title={`Read: ${book.title} (${current.seqNo}/${
            crowdinChapters.length
          })`}
          description={book.description}
        >
          {showCanonicalChapterUrl && (
            <link
              rel="canonical"
              href={`${canonicalUrl}/${book.language.code}/books/translate/${
                book.bookId
              }/edit/${current.id}`}
            />
          )}
          {prev && (
            <link
              rel="prev"
              href={`/${book.language.code}/books/translate/${
                book.bookId
              }/edit/${prev.id}`}
            />
          )}
          {next && (
            <link
              rel="next"
              href={`/${book.language.code}/books/translate/${
                book.bookId
              }/edit/${next.id}`}
            />
          )}
          {/** Require window._jipt to run script */}
          {isBrowser && <script src="https://cdn.crowdin.com/jipt/jipt.js" />}
        </Head>

        <Reader
          book={book}
          hasFrontPage
          chapterWithContent={chapters[current.id]}
          chapterPointer={current}
          onRequestNextChapter={this.handleNextChapter}
          onRequestPreviousChapter={this.handlePreviousChapter}
          onRequestClose={this.handleCloseBook}
        />
      </>
    );
  }
}

/**
 * Require window._jipt which is set in browser and not SSR
 */
function initInContext(id: string, project: string, translation: Translation) {
  window.localStorage.setItem(
    `jipt_language_code_${project}`,
    translation.to.language.code
  );
  window.localStorage.setItem(`jipt_language_id_${project}`, id);
  window.localStorage.setItem(
    `jipt_language_name_${project}`,
    translation.to.language.name
  );

  window._jipt.push(['preload_texts', true]);
  window._jipt.push(['project', project]);
  window._jipt.push([
    'escape',
    () => {
      window.location.href = '/books/translations';
    }
  ]);
}

/**
 * The previous badge for in-context translation doesn't disappear on navigation which
 * allows editing of text on previous page. This function removes the badge.
 */
function removeInContextBadge() {
  const badge = window.document.getElementById('crowdin-translation-badge');
  if (badge) badge.remove();
  const dialog = window.document.getElementsByClassName('jipt-dialog-close')[0];
  if (dialog) dialog.click();
}

/**
 * Used to force the browser the begin loading images
 */
function preloadImages(urls) {
  urls.forEach(url => {
    const image = new Image();
    image.src = url;
  });
}

export default withRouter(withErrorPage(TranslateEditPage));
