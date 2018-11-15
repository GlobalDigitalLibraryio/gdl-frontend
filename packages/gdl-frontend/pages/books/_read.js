// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { coverImageUrl } from 'gdl-image';

import { Router } from '../../routes';
import { fetchBook, fetchChapter } from '../../fetch';
import { hasClaim, claims } from 'gdl-auth';
import type { ConfigShape, BookDetails, Chapter, Context } from '../../types';
import { withErrorPage } from '../../hocs';
import Reader from '../../components/Reader';

const {
  publicRuntimeConfig: { canonicalUrl }
}: ConfigShape = getConfig();

type Props = {
  book: BookDetails,
  chapter: Chapter,
  userHasEditAccess: boolean,
  showCanonicalChapterUrl: boolean
};

type State = {
  chapters: Map<number, Chapter>,
  current: { id: number, seqNo: number }
};

class Read extends React.Component<Props, State> {
  static async getInitialProps({ query, req }: Context) {
    const bookRes = await fetchBook(query.id, query.lang);

    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }

    const book = bookRes.data;

    // If no chapter is specified, we get the first one
    const chapterId = query.chapterId ? query.chapterId : book.chapters[0].id;

    const chapterRes = await fetchChapter(query.id, chapterId, query.lang);

    if (!chapterRes.isOk) {
      return {
        statusCode: chapterRes.statusCode
      };
    }

    return {
      userHasEditAccess: hasClaim(claims.writeBook, req),
      chapter: chapterRes.data,
      book,
      showCanonical: !query.chapterId
    };
  }

  constructor(props: Props) {
    super(props);
    const { chapter, book } = props;

    // Init the chapters map with chapter we already have
    const chapters = new Map<number, Chapter>([[chapter.id, chapter]]);

    const current = book.chapters.find(c => c.id === chapter.id);

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
    const { book } = this.props;
    const indexOfCurrent = book.chapters.indexOf(this.state.current);
    return book.chapters[indexOfCurrent + 1];
  }

  getPrevious() {
    const { book } = this.props;
    const indexOfCurrent = book.chapters.indexOf(this.state.current);
    return book.chapters[indexOfCurrent - 1];
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
      'read',
      {
        id: this.props.book.id,
        lang: this.props.book.language.code,
        chapterId: this.state.current.id
      },
      { shallow: true }
    );

  async loadChapter(chapterId: number) {
    // Make sure we haven't loaded the chapter already
    if (this.state.chapters.has(chapterId)) return;

    const result = await fetchChapter(
      this.props.book.id,
      chapterId,
      this.props.book.language.code
    );

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

  render() {
    const { book, userHasEditAccess, showCanonicalChapterUrl } = this.props;
    const { chapters, current } = this.state;
    const next = this.getNext();
    const prev = this.getPrevious();

    return (
      <>
        <Head
          title={`Read: ${book.title} (${current.seqNo}/${
            book.chapters.length
          })`}
          description={book.description}
          image={book.coverImage && coverImageUrl(book.coverImage)}
        >
          {showCanonicalChapterUrl && (
            <link
              rel="canonical"
              href={`${canonicalUrl}/${book.language.code}/books/read/${
                book.id
              }/${current.id}`}
            />
          )}
          {prev && (
            <link
              rel="prev"
              href={`/${book.language.code}/books/read/${book.id}/${prev.id}`}
            />
          )}
          {next && (
            <link
              rel="next"
              href={`/${book.language.code}/books/read/${book.id}/${next.id}`}
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
          userHasEditAccess={userHasEditAccess}
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

export default withErrorPage(Read);
