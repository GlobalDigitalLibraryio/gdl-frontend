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
import type { Book, Chapter } from '../../types';
import Backdrop from './Backdrop';
import Page from './Page';
import Modal from './Modal';
import Header from './Header';
import Footer from './Footer';
import Container from '../Container';
import KeyDown from '../KeyDown';
import media from '../helpers/media';

type Props = {
  book: Book,
  onClose(): void,
};

type State = {
  currentChapter: number,
  chapters: { [number]: Chapter | 'loading' | null },
};

function createMarkup(chapter: Chapter) {
  return { __html: chapter.content };
}

const Card = styled.div`
  ${media.tablet`border-radius: 4px;`} background: #fff;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

class Reader extends React.Component<Props, State> {
  state = {
    currentChapter: 0,
    chapters: this.props.book.chapters.reduce((acc, chapter, index) => {
      acc[index] = null;
      return acc;
    }, {}),
  };

  componentDidMount() {
    this.loadChapter(this.state.currentChapter);
  }

  async loadChapter(chapterNumber: number) {
    const maybeChapter = this.state.chapters[chapterNumber];

    if (!maybeChapter || maybeChapter !== 'loading') {
      const chapterRes = await fetch(
        this.props.book.chapters[chapterNumber].url,
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

  handleNextChapter = () => {
    this.loadChapter(this.state.currentChapter + 1);
    this.setState(state => ({ currentChapter: state.currentChapter + 1 }));
  };

  handlePrevChapter = () => {
    this.loadChapter(this.state.currentChapter - 1);
    this.setState(state => ({ currentChapter: state.currentChapter - 1 }));
  };

  render() {
    const { currentChapter } = this.state;
    const { book } = this.props;

    const chapter = this.state.chapters[this.state.currentChapter];

    return (
      <Modal>
        <KeyDown when="Escape" then={this.props.onClose} />
        <KeyDown
          when="ArrowRight"
          then={this.handleNextChapter}
          disabled={currentChapter >= book.chapters.length - 1}
        />
        <KeyDown
          when="ArrowLeft"
          then={this.handlePrevChapter}
          disabled={currentChapter < 1}
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
            {chapter && chapter !== 'loading' ? (
              <Page dangerouslySetInnerHTML={createMarkup(chapter)} />
            ) : (
              <Page />
            )}
            <Footer
              disableNext={currentChapter >= book.chapters.length - 1}
              disablePrev={currentChapter < 1}
              onNextChapter={this.handleNextChapter}
              onPrevChapter={this.handlePrevChapter}
            >
              Chapter {currentChapter + 1} / {book.chapters.length}
            </Footer>
          </Card>
        </Container>
      </Modal>
    );
  }
}

export default Reader;
