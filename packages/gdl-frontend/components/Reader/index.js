// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'react-emotion';
import Swipeable from 'react-swipeable';

import Head from '../Head';
import { fetchChapter } from '../../fetch';
import type { BookDetails, Chapter, ChapterSummary } from '../../types';
import { Backdrop, Page } from './styledReader';
import Toolbar from './Toolbar';
import Container from '../Container';
import KeyDown from '../KeyDown';
import ButtonOverlay from './ButtonOverlay';
import { Router } from '../../routes';
import { colors } from '../../style/theme';
import media from '../../style/media';

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

const Div = styled('div')`
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 20px;
  flex: 1 auto;
  ${media.tablet`
    padding-left: 120px;
    padding-right: 120px;
  `};
`;

type ReaderProps = {|
  book: BookDetails,
  onRequestClose(): void,
  chapterWithContent: ?Chapter,
  chapterPointer: ChapterSummary,
  onRequestNext(): void,
  onRequestPrevious(): void,
  userHasEditAccess?: boolean
|};

type ReaderState = {
  showOverlay: boolean
};

const OVERLAY_TIMEOUT = 3000; // 3 seconds

class Reader extends React.PureComponent<ReaderProps, ReaderState> {
  state = {
    showOverlay: false
  };

  componentWillUnmount() {
    // Make sure we clean up after ourselves so we don't try to setState after we've unmounted
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
  }

  onTap = (event: SyntheticTouchEvent<>) => {
    // If we clicked a button, ignore the tap
    if (event.target.type === 'button') {
      return;
    }

    // Toggle the overlay and clear/set timer accordingly
    this.setState(
      state => ({ showOverlay: !state.showOverlay }),
      () => {
        if (this.state.showOverlay) {
          this.timerId = window.setTimeout(
            () => this.setState({ showOverlay: false }),
            OVERLAY_TIMEOUT
          );
        } else {
          window.clearTimeout(this.timerId);
        }
      }
    );
  };

  timerId: number;

  render() {
    const { book, chapterWithContent, chapterPointer } = this.props;

    const disableNext = chapterPointer.seqNo >= book.chapters.length;
    const disablePrev = chapterPointer.seqNo <= 1;

    return (
      <Container px={0} size="large">
        <Backdrop />
        <Card>
          <Toolbar
            book={this.props.book}
            chapter={chapterPointer}
            userHasEditAccess={this.props.userHasEditAccess}
            onRequestClose={this.props.onRequestClose}
          />
          {/*
            We don't want the swiping/touch presses to trigger on the toolbar. So we wrap with Swipable here instead of around the entire Card.
            It is important that Swipable includes the Buttons, so we can start swiping all the way from edge of the screens
          */}
          <Swipeable
            onSwipedLeft={this.props.onRequestNext}
            onSwipedRight={this.props.onRequestPrevious}
            onTap={this.onTap}
            css={{ flex: 1, paddingTop: '20px' }}
          >
            <Div lang={book.language.code}>
              {chapterWithContent && (
                <Page
                  dangerouslySetInnerHTML={createMarkup(chapterWithContent)}
                />
              )}
            </Div>
            <ButtonOverlay
              showOnMobile={this.state.showOverlay}
              onRequestNext={this.props.onRequestNext}
              onRequestPrev={this.props.onRequestPrevious}
              disableNext={disableNext}
              disablePrev={disablePrev}
            />
          </Swipeable>
        </Card>
        <KeyDown
          when="ArrowRight"
          then={this.props.onRequestNext}
          disabled={disableNext}
        />
        <KeyDown when="Escape" then={this.props.onRequestClose} />
        <KeyDown
          when="ArrowLeft"
          then={this.props.onRequestPrevious}
          disabled={disablePrev}
        />
      </Container>
    );
  }
}

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
      <React.Fragment>
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
          onRequestNext={this.handleRequestNextChapter}
          onRequestPrevious={this.handleRequestPreviousChapter}
          onRequestClose={this.handleRequestCloseBook}
          userHasEditAccess={this.props.userHasEditAccess}
        />
      </React.Fragment>
    );
  }
}
