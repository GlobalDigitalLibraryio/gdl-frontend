// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'react-emotion';

import { Backdrop, Page } from './styledReader';
import Toolbar, { type Book } from './Toolbar';
import Container from '../../elements/Container';
import KeyDown from '../KeyDown';
import PageNavigation from './PageNavigation';
import { colors } from '../../style/theme';

type Chapter = $ReadOnly<{ content: string }>;
type Props = {|
  book: Book,
  onRequestClose(): void,
  chapterWithContent: ?Chapter,
  chapterPointer: $ReadOnly<{ id: string, chapterId: number, seqNo: number }>,
  onRequestNextChapter(): void,
  onRequestPreviousChapter(): void
|};

const Reader = ({
  book,
  chapterWithContent,
  chapterPointer,
  onRequestNextChapter,
  onRequestPreviousChapter,
  onRequestClose
}: Props) => {
  const isRtlLanguage = book.language.isRTL;

  return (
    <Container size="large" gutter={false}>
      <Backdrop />
      <Card>
        <Toolbar
          book={book}
          chapter={chapterPointer}
          onRequestClose={onRequestClose}
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
      <KeyDown when="Escape" then={onRequestClose} />
    </Container>
  );
};

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

export default Reader;
