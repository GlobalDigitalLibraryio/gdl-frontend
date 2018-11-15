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
  publicRuntimeConfig: { canonicalUrl }
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

class Crowdin extends React.Component<Props, State> {
  static async getInitialProps({ query, req }: Context) {
    const bookRes = await fetchBook(query.id, query.lang);

    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }
    const book = bookRes.data;

    const crowdin = await fetchCrowdinBook(133, 'en');
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

  // Preload the next and previous chapters, so we are ready when the user navigates
  componentDidMount() {
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

  // Go back to the book details when closing the reader
  handleCloseBook = () => {
    const { book } = this.props;
    Router.replaceRoute('book', {
      id: book.id,
      lang: book.language.code
    });
  };

  changeChapterInUrl = () =>
    Router.replaceRoute(
      'crowdin',
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
              href={`${canonicalUrl}/${book.language.code}/books/read/${
                book.id
              }/${current.id}`}
            />
          )}
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `var _jipt = [];
              _jipt.push(['preload_texts', true]);
              _jipt.push(['project', 'gdl-demo-en']);
              `
            }}
          />
          <script type="text/javascript" src="//cdn.crowdin.com/jipt/jipt.js" />
          {prev && (
            <link
              rel="prev"
              href={`/${book.language.code}/books/crowdin/${book.id}/${
                prev.id
              }`}
            />
          )}
          {next && (
            <link
              rel="next"
              href={`/${book.language.code}/books/crowdin/${book.id}/${
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
 * Used to force the browser the begin loading images
 */
function preloadImages(urls) {
  urls.forEach(url => {
    const image = new Image();
    image.src = url;
  });
}

export default withRouter(Crowdin);
