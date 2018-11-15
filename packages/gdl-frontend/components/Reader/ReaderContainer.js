// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { coverImageUrl } from 'gdl-image';

import Head from '../Head';
import { fetchChapter } from '../../fetch';
import type { BookDetails, Chapter } from '../../types';
import { Router } from '../../routes';
import Reader from './index';

/**
 * The container has state and logic for switching/fetching chapters
 */

type ReaderContainerState = {
  chapters: { [number]: Chapter },
  chapterPointer: { id: number, seqNo: number }
};

type ReaderContainerProps = {|
  book: BookDetails,
  chapter: Chapter,
  userHasEditAccess?: boolean
|};

export default class ReaderContainer extends React.Component<
  ReaderContainerProps,
  ReaderContainerState
> {
  state = {
    chapters: { [this.props.chapter.id]: this.props.chapter },
    chapterPointer: this.props.book.chapters.find(
      c => c.id === this.props.chapter.id
    ) || { id: this.props.chapter.id, seqNo: this.props.chapter.seqNo }
  };

  // Preload the next and previous chapters, so we are ready when the user navigates
  componentDidMount() {
    const next = this.getNextChapterPointer();
    if (next) {
      this.loadChapter(next.id);
    }

    const prev = this.getPreviousChapterPointer();
    if (prev) {
      this.loadChapter(prev.id);
    }
  }

  // Go back to the book details when closing the reader
  handleRequestCloseBook = () => {
    Router.replaceRoute('book', {
      id: this.props.book.id,
      lang: this.props.book.language.code
    });
  };

  getNextChapterPointer() {
    const indexOfCurrent = this.props.book.chapters.indexOf(
      this.state.chapterPointer
    );
    return this.props.book.chapters[indexOfCurrent + 1];
  }

  getPreviousChapterPointer() {
    const indexOfCurrent = this.props.book.chapters.indexOf(
      this.state.chapterPointer
    );
    return this.props.book.chapters[indexOfCurrent - 1];
  }

  handleRequestNextChapter = () => {
    const next = this.getNextChapterPointer();
    if (next) {
      this.loadChapter(next.id);
      this.setState({ chapterPointer: next }, () => {
        // Change the URL, and start preloading
        this.changeChapterInUrl();
        const next = this.getNextChapterPointer();
        next && this.loadChapter(next.id);
      });
    }
  };

  handleRequestPreviousChapter = () => {
    const prev = this.getPreviousChapterPointer();
    if (prev) {
      this.loadChapter(prev.id);
      this.setState({ chapterPointer: prev }, () => {
        // Change the URL, and start preloading
        this.changeChapterInUrl();
        const prev = this.getPreviousChapterPointer();
        prev && this.loadChapter(prev.id);
      });
    }
  };

  changeChapterInUrl = () =>
    Router.replaceRoute(
      'read',
      {
        id: this.props.book.id,
        lang: this.props.book.language.code,
        chapterId: this.state.chapterPointer.id
      },
      { shallow: true }
    );

  async loadChapter(chapterId: number) {
    // Make sure we haven't loaded the chapter already
    if (!this.state.chapters[chapterId]) {
      const chapterRes = await fetchChapter(
        this.props.book.id,
        chapterId,
        this.props.book.language.code
      );

      // TODO: Notify user of error
      if (!chapterRes.isOk) {
        return;
      }

      const chapter = chapterRes.data;

      preloadImages(chapter.images);

      this.setState((state: ReaderContainerState) => ({
        chapters: {
          ...state.chapters,
          [chapter.id]: chapter
        }
      }));
    }
  }

  render() {
    const next = this.getNextChapterPointer();
    const prev = this.getPreviousChapterPointer();
    const { book } = this.props;
    return (
      <>
        <Head
          title={`Read: ${book.title} (${this.state.chapterPointer.seqNo}/${
            this.props.book.chapters.length
          })`}
          description={book.description}
          image={book.coverImage && coverImageUrl(book.coverImage)}
        >
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
          book={this.props.book}
          chapterWithContent={this.state.chapters[this.state.chapterPointer.id]}
          chapterPointer={this.state.chapterPointer}
          onRequestNextChapter={this.handleRequestNextChapter}
          onRequestPreviousChapter={this.handleRequestPreviousChapter}
          onRequestClose={this.handleRequestCloseBook}
          userHasEditAccess={this.props.userHasEditAccess}
        />
      </>
    );
  }
}

/**
 * Force the browser the begin loading the images
 */
function preloadImages(urls) {
  urls.forEach(url => {
    const image = new Image();
    image.src = url;
  });
}
