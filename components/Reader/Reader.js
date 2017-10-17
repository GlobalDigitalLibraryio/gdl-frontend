// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import Error from 'next/error';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import type { Book, Chapter } from '../../types';
import Backdrop from './Backdrop';
import Page from './Page';
import Modal from './Modal';
import Header from './Header';
import Footer from './Footer';
import Container from '../Container';
import KeyDown from '../KeyDown';
import media from '../helpers/media';
import { Router } from '../../routes';

type Props = {
  book: Book,
  onClose(): void,
  chapter: number,
};

type State = {
  chapters: { [number]: Chapter },
};

function createMarkup(chapter: Chapter) {
  return { __html: chapter.content };
}

const Card = styled.div`
  ${media.tablet`border-radius: 4px;`} background: ${props =>
      props.theme.grays.white};
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

class Reader extends React.Component<Props, State> {
  static defaultProps = {
    chapter: 1,
  };

  state = {
    chapters: {},
  };

  componentDidMount() {
    this.loadChapter(this.props.chapter);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.chapter !== this.props.chapter) {
      this.loadChapter(nextProps.chapter);
    }
  }

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

  changeChapter = (chapter: number) => {
    Router.pushRoute(
      'book',
      { id: this.props.book.id, lang: this.props.book.language.code, chapter },
      { shallow: true },
    );
    // Begin loading the chapter right away
    this.loadChapter(chapter);
  };

  handleNextChapter = () => {
    this.changeChapter(this.props.chapter + 1);
  };

  handlePrevChapter = () => {
    this.changeChapter(this.props.chapter - 1);
  };

  render() {
    const { book, chapter } = this.props;

    // If this isn't a valid chapter. Render the 404 page
    if (chapter < 1 || chapter > this.props.book.chapters.length) {
      return <Error statusCode={404} />;
    }

    const maybeChapter = this.state.chapters[chapter];

    return (
      <Modal>
        <KeyDown when="Escape" then={this.props.onClose} />
        <KeyDown
          when="ArrowRight"
          then={this.handleNextChapter}
          disabled={chapter >= book.chapters.length}
        />
        <KeyDown
          when="ArrowLeft"
          then={this.handlePrevChapter}
          disabled={chapter <= 1}
        />
        <Backdrop />
        <Container
          h={['100vh', '994px']}
          w={['100vw', 738]}
          mh="100vh"
          mw="100vw"
          px={0}
          mt={[0, 80]}
        >
          <Card>
            <Header onClose={this.props.onClose} title={book.title} />
            {maybeChapter && maybeChapter !== 'loading' ? (
              <Page dangerouslySetInnerHTML={createMarkup(maybeChapter)} />
            ) : (
              <Page />
            )}
            <Footer
              disableNext={chapter >= book.chapters.length}
              disablePrev={chapter <= 1}
              onNextChapter={this.handleNextChapter}
              onPrevChapter={this.handlePrevChapter}
            >
              {chapter} / {book.chapters.length}
            </Footer>
          </Card>
        </Container>
      </Modal>
    );
  }
}

// Wrap our Reader component to convert chapter as string to a number. We receive the chapter as a string because we read it from the URL, but we want to use number in Reader because we use the chapter to index into arrays
export default (props: { ...$Exact<Props>, chapter: string }) => (
  <Reader
    book={props.book}
    onClose={props.onClose}
    chapter={parseInt(props.chapter, 10)}
  />
);
