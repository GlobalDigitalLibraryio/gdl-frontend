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
import doFetch from '../../fetch';
import Box from '../Box';
import type { BookDetails, Chapter } from '../../types';
import Backdrop from './Backdrop';
import Page from './Page';
import Toolbar from './Toolbar';
import Container from '../Container';
import KeyDown from '../KeyDown';
import BookMeta from './BookMeta';
import ButtonOverlay from './ButtonOverlay';
import { Router } from '../../routes';
import theme from '../../style/theme';

function createMarkup(chapter: Chapter) {
  return { __html: chapter.content };
}

const Card = styled.div`
  background: ${theme.colors.white};
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

type ReaderProps = {
  book: BookDetails,
  onRequestClose(): void,
  chapter: ?Chapter,
  chapterNumber: number,
  onRequestNext(): void,
  onRequestPrevious(): void
};

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
    const { book, chapter, chapterNumber } = this.props;
    const numOfChapters = book.chapters.length;

    const disableNext = chapterNumber >= numOfChapters;
    const disablePrev = chapterNumber <= 1;

    return (
      <Container px={0} size="large">
        <Backdrop />
        <Swipeable
          onSwipedLeft={this.props.onRequestNext}
          onSwipedRight={this.props.onRequestPrevious}
          onTap={this.onTap}
        >
          <Card>
            <Toolbar
              onRequestClose={this.props.onRequestClose}
              currentChapter={chapterNumber}
              totalChapters={numOfChapters}
            />
            <Box
              px={[40, 120]}
              pb={20}
              flex="1 0 auto"
              lang={book.language.code}
            >
              {chapter && (
                <Page dangerouslySetInnerHTML={createMarkup(chapter)} />
              )}
              <BookMeta book={book} />
            </Box>
          </Card>
        </Swipeable>
        <ButtonOverlay
          showOnMobile={this.state.showOverlay}
          onRequestNext={this.props.onRequestNext}
          onRequestPrev={this.props.onRequestPrevious}
          disableNext={disableNext}
          disablePrev={disablePrev}
        />
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
  chapter: number
};

type ReaderContainerProps = {
  book: BookDetails,
  initialChapter: ?string
};

export default class ReaderContainer extends React.Component<
  ReaderContainerProps,
  ReaderContainerState
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
      chapter: initialChapter
    };
  }

  componentDidMount() {
    this.loadChapter(this.state.chapter);
    // Load the next and previous chapters
    this.loadChapter(this.state.chapter + 1);
    this.loadChapter(this.state.chapter - 1);
  }

  // Go back to the book details when closing the reader
  onRequestClose = () => {
    Router.replaceRoute('book', {
      id: this.props.book.id,
      lang: this.props.book.language.code
    });
  };

  onRequestNext = () => {
    if (this.state.chapter < this.props.book.chapters.length) {
      // Start loading the chaper that follows the one we're changing to
      this.loadChapter(this.state.chapter + 2);
      this.setState(
        state => ({ chapter: state.chapter + 1 }),
        this.changeChapterInUrl
      );
    }
  };

  onRequestPrevious = () => {
    if (this.state.chapter > 1) {
      // Start loading the chaper that precedes the one we're changing to
      this.loadChapter(this.state.chapter - 2);
      this.setState(
        state => ({ chapter: state.chapter - 1 }),
        this.changeChapterInUrl
      );
    }
  };

  changeChapterInUrl = () =>
    Router.replaceRoute(
      'read',
      {
        id: this.props.book.id,
        lang: this.props.book.language.code,
        chapter: this.state.chapter
      },
      { shallow: true }
    );

  async loadChapter(chapterNumber: number) {
    const chapterIndex = chapterNumber - 1;
    // Bail out if the chapter is out of range
    if (chapterIndex < 0 || chapterIndex >= this.props.book.chapters.length) {
      return;
    }

    const maybeChapter = this.state.chapters[chapterNumber];

    if (!maybeChapter && this.props.book.chapters[chapterIndex]) {
      const chapter = await doFetch(this.props.book.chapters[chapterIndex].url);

      this.setState((state: ReaderContainerState) => ({
        chapters: {
          ...state.chapters,
          [chapterNumber]: chapter
        }
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
