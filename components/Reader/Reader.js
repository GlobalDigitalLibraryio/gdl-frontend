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
import Header from './Header';
import Footer from './Footer';
import Container from '../Container';
import KeyDown from '../KeyDown';
import media from '../helpers/media';
import { Router } from '../../routes';

/* eslint-disable react/no-multi-comp */

type ReaderProps = {
  book: Book,
  onRequestClose(): void,
  chapter: Chapter,
  onRequestNext(): void,
  onRequestPrevious(): void,
};

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

class Reader extends React.Component<ReaderProps> {
  static defaultProps = {
    chapter: 1,
  };

  changeChapter = (chapter: number) => {
    Router.pushRoute(
      'book',
      { id: this.props.book.id, lang: this.props.book.language.code, chapter },
      { shallow: true },
    );
    // Begin loading the chapter right away
    this.loadChapter(chapter);
  };

  render() {
    const { book } = this.props;

    // If this isn't a valid chapter. Render the 404 page
    /* if (chapter < 1 || chapter > this.props.book.chapters.length) {
      return <Error statusCode={404} showNavbar={false} />;
    } */

    return (
      <Backdrop>
        <Container px={0}>
          <Card>
            <Header onRequestClose={this.props.onRequestClose} />
            <Box px={[40, 120]} flex="1 0 auto">
              <Page
                dangerouslySetInnerHTML={createMarkup(this.props.chapter)}
              />
              {book.title}
            </Box>
            <Footer
              onRequestNext={this.props.onRequestNext}
              onRequestPrevious={this.props.onRequestPrevious}
            >
              1 / {book.chapters.length}
            </Footer>
          </Card>
        </Container>
        <KeyDown when="ArrowRight" then={this.props.onRequestNext} />
        <KeyDown when="ArrowLeft" then={this.props.onRequestPrevious} />
      </Backdrop>
    );
  }
}

// Wrap our Reader component to convert chapter as string to a number. We receive the chapter as a string because we read it from the URL, but we want to use number in Reader because we use the chapter to index into arrays
/* export default (props: { ...$Exact<Props>, chapter: string }) => (
  <Reader
    book={props.book}
    onClose={props.onClose}
    chapter={parseInt(props.chapter, 10)}
  />
); */

type State = {
  chapters: { [number]: Chapter },
  chapter: number,
};

type ReaderContainerProps = {
  book: Book,
};

export default class ReaderContainer extends React.Component<
  ReaderContainerProps,
  State,
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
    const maybeChapter = this.state.chapters[chapterNumber];

    if (!maybeChapter && this.props.book.chapters[chapterNumber - 1]) {
      const chapterRes = await fetch(
        this.props.book.chapters[chapterNumber - 1].url,
      );
      const chapter = await chapterRes.json();

      this.setState((state: State) => ({
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
      />
    );
  }
}
