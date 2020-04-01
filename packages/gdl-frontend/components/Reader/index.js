// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from '@emotion/styled';
import { Typography } from '@material-ui/core';

import { Backdrop, Page } from './styledReader';
import Toolbar, { type Book } from './Toolbar';
import Container from '../../elements/Container';
import KeyDown from '../KeyDown';
import PageNavigation from './PageNavigation';
import EmbedPageNavigation from './EmbedPageNavigation';
import { colors } from '../../style/theme';
import { type CrowdinBook_crowdinBook_frontPage as FrontPageType } from '../../gqlTypes';
import type { ChapterContent, ChapterPointer } from '../../types';

type Props = {|
  book: Book,
  onRequestClose(): void,
  chapterPointer: ChapterPointer,
  hasFrontPage?: boolean,
  chapterWithContent: ?(FrontPageType | ChapterContent),
  onRequestNextChapter(): void,
  onRequestPreviousChapter(): void,
  showToolbarIcons?: boolean
|};

const Reader = ({
  book,
  hasFrontPage,
  chapterWithContent,
  chapterPointer,
  onRequestNextChapter,
  onRequestPreviousChapter,
  onRequestClose,
  showToolbarIcons = true
}: Props) => {
  const isRtlLanguage = book.language.isRTL;

  return (
    <Container size="large" gutter={false}>
      <Backdrop />
      <Card>
        {showToolbarIcons ? 
        <Toolbar
          book={book}
          chapter={chapterPointer}
          onRequestClose={onRequestClose}
          showToolbarIcons={showToolbarIcons}
        /> :
        
        (<EmbedPageNavigation css={{ flex: 1 }}
          isRtlLanguage={isRtlLanguage}
          onRequestNextChapter={onRequestNextChapter}
          onRequestPreviousChapter={onRequestPreviousChapter}
          disableNext={chapterPointer.seqNo >= book.chapters.length}
          disablePrevious={
            hasFrontPage ? chapterPointer.seqNo <= 0 : chapterPointer.seqNo <= 1
          }><Toolbar
          book={book}
          chapter={chapterPointer}
          onRequestClose={onRequestClose}
          showToolbarIcons={showToolbarIcons}
        /></EmbedPageNavigation>
          )}
        {/*
            We don't want the swiping/touch presses to trigger on the toolbar. So wrap PageNavigation around the content here instead of around the entire Card.
          */}
        <PageNavigation
          css={{ flex: 1 }}
          isRtlLanguage={isRtlLanguage}
          onRequestNextChapter={onRequestNextChapter}
          onRequestPreviousChapter={onRequestPreviousChapter}
          disableNext={chapterPointer.seqNo >= book.chapters.length}
          disablePrevious={
            hasFrontPage ? chapterPointer.seqNo <= 0 : chapterPointer.seqNo <= 1
          }
        >
          {chapterWithContent &&
          chapterWithContent.chapterType === 'FrontPage' ? (
            <FrontPage
              dir={isRtlLanguage ? 'rtl' : 'ltr'}
              language={book.language.code}
              content={chapterWithContent}
            />
          ) : (
            <Page
              lang={book.language.code}
              dir={isRtlLanguage ? 'rtl' : 'ltr'}
              dangerouslySetInnerHTML={
                chapterWithContent ? createMarkup(chapterWithContent) : null
              }
            />
          )}
        </PageNavigation>
      </Card>
      <KeyDown when="Escape" then={onRequestClose} />
    </Container>
  );
};

const FrontPage = ({ content, language, dir }: any) => (
  <Page dir={dir} lang={language}>
    <img src={content.images[0]} alt="" />
    <Typography style={{ marginBottom: 30 }} variant="h3">
      {content.title}
    </Typography>
    <Typography variant="h5">{content.description}</Typography>
  </Page>
);

function createMarkup(chapter: FrontPageType | ChapterContent) {
  return { __html: chapter.content && chapter.content };
}

const Card = styled.div`
  background: ${colors.base.white};
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default Reader;
