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
import { fetchBook, fetchCrowdinBook, fetchCrowdinChapter } from '../../fetch';
import type {
  ConfigShape,
  BookDetails,
  FrontPage,
  Chapter,
  CrowdinBook,
  ChapterSummary,
  Context
} from '../../types';
const jipt = '/static/jipt.js';

const {
  publicRuntimeConfig: { canonicalUrl, crowdinProject }
}: ConfigShape = getConfig();

type Props = {
  chapter: any,
  book: BookDetails,
  crowdin: Array<ChapterSummary>,
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

    const crowdin = await fetchCrowdinBook(book.id, book.language.code);
    if (!crowdin.isOk) return { statusCode: crowdin.statusCode };

    let chapter;
    if (query.chapterId) {
      const chapterInfo =
        crowdin.data.chapters.find(
          chapter => chapter.id.toString() === query.chapterId
        ) || crowdin.data.chapters[0];

      chapter = await fetchCrowdinChapter(chapterInfo);
    }
    if (chapter && !chapter.isOk) return { statusCode: chapter.statusCode };

    const frontPage = createFrontPage(crowdin.data);
    return {
      book,
      crowdin: [frontPage, ...crowdin.data.chapters],
      chapter: chapter ? chapter.data : frontPage,
      showCanonicalChapterUrl: !query.chapterId
    };
  }

  constructor(props: Props) {
    super(props);
    const { chapter, crowdin } = props;
    // Init both frontPage and loaded chapter
    const frontPage = crowdin[0];
    const chapters = { [frontPage.id]: frontPage, [chapter.id]: chapter };

    const current = crowdin.find(c => c.id === chapter.id);

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
    const { crowdin } = this.props;
    const indexOfCurrent = crowdin.indexOf(this.state.current);
    return crowdin[indexOfCurrent + 1];
  }

  getPrevious() {
    const { crowdin } = this.props;
    const indexOfCurrent = crowdin.indexOf(this.state.current);
    return crowdin[indexOfCurrent - 1];
  }

  async loadChapter(chapterId: number) {
    // Make sure we haven't loaded the chapter already
    if (this.state.chapters[chapterId]) return;
    const { crowdin } = this.props;
    const chapterInfo =
      crowdin.find(chapter => chapter.id === chapterId) || crowdin[0];

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
          {typeof window !== 'undefined' && (
            <>
              <script src={jipt} />
              {clearInContextCache()}
            </>
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
 * Removes crowdin items from localstorage, otherwise language selection doesn't get prompted
 * And initialize crowdin in-context
 */
function clearInContextCache() {
  window.localStorage.removeItem(`jipt_language_code_${crowdinProject}`);
  window.localStorage.removeItem(`jipt_language_id_${crowdinProject}`);
  window.localStorage.removeItem(`jipt_language_name_${crowdinProject}`);

  window._jipt = [];
  window._jipt.push(['preload_texts', true]);
  window._jipt.push(['project', crowdinProject]);
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
