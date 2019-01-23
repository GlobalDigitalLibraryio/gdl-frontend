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

import { Router } from '../../routes';
import Reader from '../../components/Reader';
import {
  fetchBook,
  fetchCrowdinBook,
  fetchMyTranslations,
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
  Context,
  Language
} from '../../types';

const {
  publicRuntimeConfig: { canonicalUrl }
}: ConfigShape = getConfig();

// In-context requires that jipt is defined before the crowdin script is initialized
if (typeof window !== 'undefined') {
  window._jipt = [];
}

type Props = {
  book: BookDetails,
  translatedTo: Language,
  initialChapter: FrontPage | Chapter,
  crowdinProjectName: { [key: string]: string },
  crowdinChapters: Array<ChapterSummary>,
  showCanonicalChapterUrl: boolean
};

type State = {
  chapters: { [number]: FrontPage | Chapter },
  current: ChapterSummary
};

class TranslateEditPage extends React.Component<Props, State> {
  static async getInitialProps({ query, req }: Context) {
    console.log('query', query);
    const bookRes = await fetchBook(query.id, query.lang);
    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }
    const book = bookRes.data;
    console.log('book', book);
    const crowdinBook = await fetchCrowdinBook(book.id, book.language.code);
    if (!crowdinBook.isOk) return { statusCode: crowdinBook.statusCode };
    console.log('crowdinBook', crowdinBook);
    const crowdinProjectName = await fetchTranslationProject();
    if (!crowdinProjectName.isOk)
      return { statusCode: crowdinProjectName.statusCode };
    console.log('project', crowdinProjectName);
    // Flow complains because selectedTranslation can be undefined.
    // Graphql could handle this better.. $FlowFixMe
    const myTranslations = await fetchMyTranslations();
    if (!myTranslations.isOk) return { statusCode: myTranslations.statusCode };
    console.log('trans', myTranslations);
    const selectedTranslation = myTranslations.data.find(
      element => element.id === book.id
    );

    let initialChapter;
    const frontPage = createFrontPage(crowdinBook.data);
    console.log('front', frontPage);
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
      translatedTo: selectedTranslation.translatedTo,
      initialChapter: initialChapter ? initialChapter.data : frontPage,
      showCanonicalChapterUrl: !query.chapterId,
      crowdinProjectName: crowdinProjectName.data,
      crowdinChapters: [frontPage, ...crowdinBook.data.chapters]
    };
  }

  constructor(props: Props) {
    super(props);
    const { initialChapter, crowdinChapters } = props;
    console.log('contructor', initialChapter, crowdinChapters);
    // Create frontPage with title and description and concat with chapters
    const chapters = crowdinChapters
      ? {
          [crowdinChapters[0].id]: crowdinChapters[0],
          [initialChapter.id]: initialChapter
        }
      : { [initialChapter.id]: initialChapter };

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

    const { crowdinProjectName, book, translatedTo } = this.props;
    window.localStorage.clear();
    initInContext(book.id, crowdinProjectName.en, translatedTo);
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
      'translateEdit',
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
              }/edit/${current.id}`}
            />
          )}
          {prev && (
            <link
              rel="prev"
              href={`/${book.language.code}/books/translate/${book.id}/edit/${
                prev.id
              }`}
            />
          )}
          {next && (
            <link
              rel="next"
              href={`/${book.language.code}/books/translate/${book.id}/edit/${
                next.id
              }`}
            />
          )}
          <script src="https://cdn.crowdin.com/jipt/jipt.js" />
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

function initInContext(id: number, project: string, toLanguage: Language) {
  window.localStorage.setItem(`jipt_language_code_${project}`, toLanguage.code);
  window.localStorage.setItem(`jipt_language_id_${project}`, id);
  window.localStorage.setItem(`jipt_language_name_${project}`, toLanguage.name);

  window._jipt.push(['preload_texts', true]);
  window._jipt.push(['project', project]);
  window._jipt.push([
    'escape',
    () => {
      window.location.href = '/books/translations';
    }
  ]);
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

export default withRouter(TranslateEditPage);
