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
import Box from '../Box';
import Error from '../Error';
import type { Book, Chapter } from '../../types';
import Backdrop from './Backdrop';
import Page from './Page';
import Toolbar from './Toolbar';
import Footer from './Footer';
import Container from '../Container';
import KeyDown from '../KeyDown';
import media from '../helpers/media';
import BookMeta from './BookMeta';
import OnTouch from './OnTouch';
import TouchOverlay from './TouchOverlay';
import { Router } from '../../routes';

/* eslint-disable react/no-multi-comp */

function createMarkup(chapter: Chapter) {
  return { __html: chapter.content };
}

const Card = styled.div`
  background: ${props => props.theme.grays.white};
  height: 100vh;
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
  showToolbar: boolean,
  showTouchOverlay: boolean,
};

class Reader extends React.Component<ReaderProps, ReaderState> {
  state = {
    showToolbar: false,
    showTouchOverlay: false,
  };

  onTouch = (event: TouchEvent) => {
    console.log(event);
    this.setState({ showTouchOverlay: true });
    window.setTimeout(() => this.setState({ showTouchOverlay: false }), 3000);
  };

  render() {
    const { book, chapter, chapterNumber } = this.props;
    const numOfChapters = book.chapters.length;

    // If this isn't a valid chapter. Render the 404 page
    /* if (chapter < 1 || chapter > this.props.book.chapters.length) {
      return <Error statusCode={404} showNavbar={false} />;
    } */

    const disableNext = chapterNumber >= numOfChapters;
    const disablePrev = chapterNumber <= 1;

    return (
      <Container px={0} style={{ position: 'relative' }}>
        <Backdrop />
        <OnTouch onTouch={this.onTouch}>
          <Card>
            <Toolbar onRequestClose={this.props.onRequestClose} />
            {this.state.showTouchOverlay && (
              <TouchOverlay
                onRequestNext={this.props.onRequestNext}
                onRequestPrev={this.props.onRequestPrevious}
              />
            )}
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
            <Footer
              disableNext={disableNext}
              disablePrev={disablePrev}
              onRequestNext={this.props.onRequestNext}
              onRequestPrevious={this.props.onRequestPrevious}
            >
              {chapterNumber} / {numOfChapters}
            </Footer>
          </Card>
        </OnTouch>
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
};

export default class ReaderContainer extends React.Component<
  ReaderContainerProps,
  ReaderContainerState,
> {
  state = {
    chapters: {},
    chapter: 1,
  };

  componentDidMount() {
    this.loadChapter(this.state.chapter);
  }

  onRequestClose = () => {
    Router.replaceRoute('book', {
      id: this.props.book.id,
      lang: this.props.book.language.code,
    });
  };

  onRequestNext = () => {
    this.setState(
      state => {
        if (state.chapter < this.props.book.chapters.length) {
          return { chapter: state.chapter + 1 };
        }
        return {};
      },
      () => this.loadChapter(this.state.chapter),
    );
  };

  onRequestPrevious = () => {
    this.setState(
      state => {
        if (state.chapter > 1) {
          return { chapter: state.chapter - 1 };
        }
        return {};
      },
      () => this.loadChapter(this.state.chapter),
    );
  };

  async loadChapter(chapterNumber: number) {
    // Bail out if the chapter number is out of range
    if (chapterNumber < 1 || chapterNumber > this.props.book.chapters.length) {
      return;
    }

    const maybeChapter = this.state.chapters[chapterNumber];

    if (!maybeChapter && this.props.book.chapters[chapterNumber - 1]) {
      const chapterRes = await fetch(
        this.props.book.chapters[chapterNumber - 1].url,
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
