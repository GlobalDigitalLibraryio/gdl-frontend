// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { withRouter } from 'next/router';
import { hasClaim, claims } from 'gdl-auth';
import Head from 'next/head';
import getConfig from 'next/config';

import { Router } from '../../routes';
import Reader from '../../components/Reader';
import { fetchBook, fetchCrowdinBook, fetchCrowdinChapter } from '../../fetch';
import type { ConfigShape, BookDetails, Context } from '../../types';

const {
  publicRuntimeConfig: { canonicalUrl, crowdinProject }
}: ConfigShape = getConfig();

type Book = {
  id: number,
  title: string,
  description: string,
  coverImage: {
    url: string,
    alttext: string,
    imageId: string
  },
  chapters: Array<{ id: number, seqNo: number, url: string }>
};

type Props = {
  chapter: any,
  book: BookDetails,
  crowdin: Book,
  userHasEditAccess: boolean,
  showCanonicalChapterUrl: boolean,
  query: { lang: string, id: string }
};

type State = {
  chapters: Map<number, *>,
  current: { id: number, seqNo: number }
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

    const chapterInfo =
      crowdin.data.chapters.find(chapter => chapter.id === query.chapterId) ||
      crowdin.data.chapters[0];

    const chapter = await fetchCrowdinChapter(chapterInfo);

    if (!chapter.isOk) return { statusCode: chapter.statusCode };

    return {
      userHasEditAccess: hasClaim(claims.writeBook, req),
      book,
      crowdin: crowdin.data,
      chapter: chapter.data,
      showCanonical: !query.chapterId
    };
  }

  constructor(props: Props) {
    super(props);
    const { chapter, book, crowdin } = props;
    // Init the chapters map with chapter we already have
    const chapters = new Map<number, *>([[chapter.id, chapter]]);

    const current =
      book.chapters.find(c => c.id === chapter.id) || crowdin.chapters[0];

    if (!current) {
      throw new Error('Chapter not found in book');
    }

    this.state = {
      chapters,
      current
    };
  }

  componentDidMount() {
    clearAndStartInContext();

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
    const indexOfCurrent = crowdin.chapters.indexOf(this.state.current);
    return crowdin.chapters[indexOfCurrent + 1];
  }

  getPrevious() {
    const { crowdin } = this.props;
    const indexOfCurrent = crowdin.chapters.indexOf(this.state.current);
    return crowdin.chapters[indexOfCurrent - 1];
  }

  async loadChapter(chapterId: number) {
    // Make sure we haven't loaded the chapter already
    if (this.state.chapters.has(chapterId)) return;
    const { crowdin } = this.props;
    const chapterInfo =
      crowdin.chapters.find(chapter => chapter.id === chapterId) ||
      crowdin.chapters[0];

    const result = await fetchCrowdinChapter(chapterInfo);

    // TODO: Notify user of error
    if (!result.isOk) {
      return;
    }

    const chapter = result.data;

    this.setState(state => ({
      chapters: state.chapters.set(chapter.id, chapter)
    }));

    preloadImages(chapter.images);
  }

  handleNextChapter = () => {
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
        id: this.props.crowdin.id,
        lang: this.props.book.language.code,
        chapterId: this.state.current.id
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
          <script src="//cdn.crowdin.com/jipt/jipt.js" />
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
          chapterWithContent={chapters.get(current.id)}
          chapterPointer={current}
          onRequestNextChapter={this.handleNextChapter}
          onRequestPreviousChapter={this.handlePreviousChapter}
          onRequestClose={this.handleCloseBook}
          userHasEditAccess={false}
        />
      </>
    );
  }
}

/**
 * Removes crowdin items from localstorage, otherwise language selection doesn't get prompted
 * And initialize crowdin in-context
 */
function clearAndStartInContext() {
  window.localStorage.removeItem(`jipt_language_code_${crowdinProject}`);
  window.localStorage.removeItem(`jipt_language_id_${crowdinProject}`);
  window.localStorage.removeItem(`jipt_language_name_${crowdinProject}`);

  window._jipt = [['preload_texts', true], ['project', crowdinProject]];
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
