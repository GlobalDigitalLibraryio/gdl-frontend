// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';

import { Router } from '../../routes';
import Reader from '../../components/Reader';
import InContextTranslation from '../../components/InContextTranslation';
import {
  fetchBook,
  fetchCrowdinBook,
  fetchCrowdinChapter,
  fetchTranslationProject
} from '../../fetch';
import type {
  ConfigShape,
  BookDetails,
  FrontPage,
  Chapter,
  CrowdinBook,
  ChapterSummary,
  Context
} from '../../types';

const {
  publicRuntimeConfig: { canonicalUrl }
}: ConfigShape = getConfig();

type Props = {
  book: BookDetails,
  initialChapter: FrontPage | Chapter,
  crowdinProjectName: { en: string },
  crowdinChapters: Array<ChapterSummary>,
  showCanonicalChapterUrl: boolean
};

type State = {
  chapters: { [number]: FrontPage | Chapter },
  current: ChapterSummary
};

class TranslatePage extends React.Component<Props, State> {
  static async getInitialProps({ query, req }: Context) {
    const bookRes = await fetchBook(query.id, query.lang);
    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }
    const book = bookRes.data;

    const crowdinBook = await fetchCrowdinBook(book.id, book.language.code);
    if (!crowdinBook.isOk) return { statusCode: crowdinBook.statusCode };

    const crowdinProjectName = await fetchTranslationProject();
    if (!crowdinProjectName.isOk)
      return { statusCode: crowdinProjectName.statusCode };

    let initialChapter;
    const frontPage = createFrontPage(crowdinBook.data);

    if (query.chapterId) {
      const chapterInfo = crowdinBook.data.chapters.find(
        chapter => chapter.id.toString() === query.chapterId
      );

      // If no chapterInfo, it means the chapterId is invalid and we will show the user the frontpage
      if (!chapterInfo) return;
      initialChapter = await fetchCrowdinChapter(chapterInfo);
    }
    if (initialChapter && !initialChapter.isOk)
      return { statusCode: initialChapter.statusCode };

    return {
      book,
      initialChapter: initialChapter ? initialChapter.data : frontPage,
      showCanonicalChapterUrl: !query.chapterId,
      crowdinProjectName: crowdinProjectName.data,
      crowdinChapters: [frontPage, ...crowdinBook.data.chapters]
    };
  }

  constructor(props: Props) {
    super(props);
    const { initialChapter, crowdinChapters } = props;

    // Init both frontPage and loaded chapter
    const frontPage = crowdinChapters[0];
    const chapters = {
      [frontPage.id]: frontPage,
      [initialChapter.id]: initialChapter
    };

    const current = crowdinChapters.find(c => c.id === initialChapter.id);

    if (!current) {
      throw new Error('Chapter not found in book');
    }

    this.state = {
      chapters,
      current
    };
  }

  componentDidMount() {
    // Preload the next and previous chapters, so we are ready when the user navigates
    const next = this.getNext();
    if (next) {
      this.loadChapter(next.id);
    }

    const prev = this.getPrevious();
    if (prev) {
      this.loadChapter(prev.id);
    }
  }

  getNext() {
    const { crowdinChapters } = this.props;
    const indexOfCurrent = crowdinChapters.indexOf(this.state.current);
    return crowdinChapters[indexOfCurrent + 1];
  }

  getPrevious() {
    const { crowdinChapters } = this.props;
    const indexOfCurrent = crowdinChapters.indexOf(this.state.current);
    return crowdinChapters[indexOfCurrent - 1];
  }

  async loadChapter(chapterId: number) {
    // Make sure we haven't loaded the chapter already
    if (this.state.chapters[chapterId]) return;
    const { crowdinChapters } = this.props;
    const chapterInfo =
      crowdinChapters.find(chapter => chapter.id === chapterId) ||
      crowdinChapters[0];

    const result = await fetchCrowdinChapter(chapterInfo);

    // TODO: Notify user of error
    if (!result.isOk) {
      return;
    }

    const chapter = result.data;

    this.setState(state => ({
      chapters: { ...state.chapters, [chapter.id]: chapter }
    }));

    preloadImages(chapter.images);
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
    window.location.href = `/books/translations`;
  };

  changeChapterInUrl = () =>
    Router.replaceRoute(
      'translate',
      {
        id: this.props.book.id,
        lang: this.props.book.language.code,
        chapterId: this.state.current.id || null
      },
      { shallow: true }
    );

  render() {
    const { book, showCanonicalChapterUrl } = this.props;
    const { current, chapters } = this.state;
    const next = this.getNext();
    const prev = this.getPrevious();

    return (
      <>
        <Head
          title={`Read: ${book.title} (${current.seqNo}/${
            book.chapters.length
          })`}
          description={book.description}
        >
          {showCanonicalChapterUrl && (
            <link
              rel="canonical"
              href={`${canonicalUrl}/${book.language.code}/books/translate/${
                book.id
              }/${current.id}`}
            />
          )}
          {prev && (
            <link
              rel="prev"
              href={`/${book.language.code}/books/translate/${book.id}/${
                prev.id
              }`}
            />
          )}
          {next && (
            <link
              rel="next"
              href={`/${book.language.code}/books/translate/${book.id}/${
                next.id
              }`}
            />
          )}
        </Head>
        <InContextTranslation
          bookId={book.id.toString()}
          project={this.props.crowdinProjectName}
        >
          <Reader
            book={book}
            hasFrontPage
            chapterWithContent={chapters[current.id]}
            chapterPointer={current}
            onRequestNextChapter={this.handleNextChapter}
            onRequestPreviousChapter={this.handlePreviousChapter}
            onRequestClose={this.handleCloseBook}
          />
        </InContextTranslation>
      </>
    );
  }
}

function createFrontPage(crowdin: CrowdinBook): FrontPage {
  return {
    id: 0,
    chapterType: 'FrontPage',
    title: crowdin.title,
    description: crowdin.description,
    seqNo: 0,
    images: [crowdin.coverImage.url]
  };
}

/**
 * The previous badge for in-context translation doesn't disappear on navigation which
 * allows editing of text on previous page. This function removes the badge.
 */
function removeInContextBadge() {
  if (window.document.getElementById('crowdin-translation-badge')) {
    window.document.getElementById('crowdin-translation-badge').remove();
  }
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

export default withRouter(TranslatePage);
