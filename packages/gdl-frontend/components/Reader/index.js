// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'react-emotion';

import Head from '../Head';
import { fetchChapter } from '../../fetch';
import type { BookDetails, Chapter, ChapterSummary } from '../../types';
import { Backdrop, Page } from './styledReader';
import Toolbar from './Toolbar';
import Container from '../../elements/Container';
import KeyDown from '../KeyDown';
import PageNavigation from './PageNavigation';
import { Router } from '../../routes';
import { colors } from '../../style/theme';

function createMarkup(chapter: Chapter) {
  return { __html: chapter.content };
}

const Card = styled.div`
  background: ${colors.base.white};
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

type ReaderProps = {|
  book: BookDetails,
  onRequestClose(): void,
  chapterWithContent: ?Chapter,
  chapterPointer: ChapterSummary,
  onRequestNextChapter(): void,
  onRequestPreviousChapter(): void,
  userHasEditAccess?: boolean
|};

class Reader extends React.PureComponent<ReaderProps> {
  render() {
    const {
      book,
      chapterWithContent,
      chapterPointer,
      onRequestNextChapter,
      onRequestPreviousChapter
    } = this.props;

    const isRtlLanguage = !!book.language.isRTL;

    return (
      <Container size="large" gutter={false}>
        <Backdrop />
        <Card>
          <Toolbar
            book={this.props.book}
            chapter={chapterPointer}
            userHasEditAccess={this.props.userHasEditAccess}
            onRequestClose={this.props.onRequestClose}
          />
          {/*
            We don't want the swiping/touch presses to trigger on the toolbar. So wrap PageNavigation around the content here instead of around the entire Card.
          */}
          <PageNavigation
            css={{ flex: 1 }}
            isRtlLanguage={isRtlLanguage}
            onRequestNextChapter={onRequestNextChapter}
            onRequestPreviousChapter={onRequestPreviousChapter}
            disableNext={chapterPointer.seqNo >= book.chapters.length}
            disablePrevious={chapterPointer.seqNo <= 1}
          >
            <Page
              lang={book.language.code}
              dir={isRtlLanguage ? 'rtl' : 'ltr'}
              dangerouslySetInnerHTML={
                chapterWithContent ? createMarkup(chapterWithContent) : null
              }
            />
          </PageNavigation>
        </Card>
        <KeyDown when="Escape" then={this.props.onRequestClose} />
      </Container>
    );
  }
}

/**
 * The container has state and logic for switching/fetching chapters
 */

type ReaderContainerState = {
  chapters: { [number]: Chapter },
  chapterPointer: ChapterSummary
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
          image={book.coverImage && book.coverImage.url}
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
