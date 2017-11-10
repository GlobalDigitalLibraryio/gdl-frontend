// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import Swipeable from 'react-swipeable';
import Box from '../Box';
import type { Book, Chapter } from '../../types';
import Backdrop from './Backdrop';
import Page from './Page';
import Toolbar from './Toolbar';
import Container from '../Container';
import KeyDown from '../KeyDown';
import BookMeta from './BookMeta';
import TouchOverlay from './TouchOverlay';
import { Router } from '../../routes';

/* eslint-disable react/no-multi-comp */

function createMarkup(chapter: Chapter) {
  return { __html: chapter.content };
}

const Card = styled.div`
  background: ${props => props.theme.grays.white};
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

type ReaderProps = {
  book: Book,
  onRequestClose(): void,
  chapter: ?Chapter,
  chapterNumber: number,
  onRequestNext(): void,
  onRequestPrevious(): void,
};

type ReaderState = {
  showOverlay: boolean,
};

class Reader extends React.PureComponent<ReaderProps, ReaderState> {
  state = {
    showOverlay: false,
  };

  onTap = (event: SyntheticTouchEvent<>) => {
    const currentX = event.changedTouches[0].clientX;
    if (currentX < 70) {
      this.props.onRequestPrevious();
    } else if (currentX > screen.width - 70) {
      this.props.onRequestNext();
    } else {
      this.setState(state => ({ showOverlay: !state.showOverlay }));
    }
  };

  render() {
    const { book, chapter, chapterNumber } = this.props;
    const numOfChapters = book.chapters.length;

    const disableNext = chapterNumber >= numOfChapters;
    const disablePrev = chapterNumber <= 1;

    return (
      <Container px={0} mw={1075}>
        <Backdrop />
        {this.state.showOverlay && (
          <TouchOverlay
            onRequestNext={this.props.onRequestNext}
            onRequestPrev={this.props.onRequestPrevious}
          />
        )}
        <Swipeable
          onSwipedLeft={this.props.onRequestNext}
          onSwipedRight={this.props.onRequestPrevious}
          onTap={this.onTap}
        >
          <Card>
            <Toolbar
              showOnMobile={this.state.showOverlay}
              onRequestClose={this.props.onRequestClose}
            />
            <BookMeta
              currentChapter={chapterNumber}
              totalChapters={numOfChapters}
              hideOnTablet
            />
            <Box px={[40, 120]} pb={20} flex="1 0 auto">
              {chapter && (
                <Page dangerouslySetInnerHTML={createMarkup(chapter)} />
              )}
              <BookMeta
                currentChapter={chapterNumber}
                totalChapters={numOfChapters}
                title={book.title}
              />
            </Box>
          </Card>
        </Swipeable>
        <KeyDown
          when="ArrowRight"
          then={this.props.onRequestNext}
          disabled={disableNext}
        />
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
  chapter: number,
};

type ReaderContainerProps = {
  book: Book,
  initialChapter: ?string,
};

export default class ReaderContainer extends React.Component<
  ReaderContainerProps,
  ReaderContainerState,
> {
  constructor(props: ReaderContainerProps) {
    super(props);

    // Convert the chapter in the url to an int and make sure it is in a valid chapter range (or be set to 1)
    let initialChapter = parseInt(props.initialChapter, 10) || 1;
    if (initialChapter < 1 || initialChapter > props.book.chapters.length) {
      initialChapter = 1;
    }

    this.state = {
      chapters: {},
      chapter: initialChapter,
    };
  }

  componentDidMount() {
    this.loadChapter(this.state.chapter);
    // Load the next chapter
    this.loadChapter(this.state.chapter + 1);
  }

  // Go back to the book details when closing the reader
  onRequestClose = () => {
    Router.replaceRoute('book', {
      id: this.props.book.id,
      lang: this.props.book.language.code,
    });
  };

  onRequestNext = () => {
    if (this.state.chapter < this.props.book.chapters.length) {
      this.loadChapter(this.state.chapter + 1);
      this.loadChapter(this.state.chapter + 2);
      this.setState(
        state => ({ chapter: state.chapter + 1 }),
        this.changeChapterInUrl,
      );
    }
  };

  onRequestPrevious = () => {
    if (this.state.chapter > 1) {
      this.loadChapter(this.state.chapter - 1);
      this.loadChapter(this.state.chapter - 2);
      this.setState(
        state => ({ chapter: state.chapter - 1 }),
        this.changeChapterInUrl,
      );
    }
  };

  changeChapterInUrl = () =>
    Router.replaceRoute(
      'read',
      {
        id: this.props.book.id,
        lang: this.props.book.language.code,
        chapter: this.state.chapter,
      },
      { shallow: true },
    );

  async loadChapter(chapterNumber: number) {
    const chapterIndex = chapterNumber - 1;
    // Bail out if the chapter is out of range
    if (chapterIndex < 0 || chapterIndex >= this.props.book.chapters.length) {
      return;
    }

    const maybeChapter = this.state.chapters[chapterNumber];

    if (!maybeChapter && this.props.book.chapters[chapterIndex]) {
      const chapterRes = await fetch(
        this.props.book.chapters[chapterIndex].url,
      );
      const chapter = await chapterRes.json();

      this.setState((state: ReaderContainerState) => ({
        chapters: {
          ...state.chapters,
          [chapterNumber]: chapter,
        },
      }));
    }
  }

  render() {
    return (
      <Reader
        book={this.props.book}
        chapter={this.state.chapters[this.state.chapter]}
        onRequestNext={this.onRequestNext}
        onRequestPrevious={this.onRequestPrevious}
        onRequestClose={this.onRequestClose}
        chapterNumber={this.state.chapter}
      />
    );
  }
}
