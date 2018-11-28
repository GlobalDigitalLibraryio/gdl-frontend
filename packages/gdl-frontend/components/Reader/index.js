// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'react-emotion';
import { CircularProgress } from '@material-ui/core';

import type { BookDetails, Chapter } from '../../types';
import { Backdrop, Page } from './styledReader';
import Toolbar from './Toolbar';
import Container from '../../elements/Container';
import KeyDown from '../KeyDown';
import PageNavigation from './PageNavigation';
import { colors } from '../../style/theme';

type Props = {|
  book: BookDetails,
  loading: boolean,
  onRequestClose(): void,
  chapterWithContent: ?Chapter,
  chapterPointer: { id: number, seqNo: number },
  onRequestNextChapter(): void,
  onRequestPreviousChapter(): void,
  userHasEditAccess?: boolean
|};

const Reader = ({
  book,
  loading,
  chapterWithContent,
  chapterPointer,
  onRequestNextChapter,
  onRequestPreviousChapter,
  onRequestClose,
  userHasEditAccess
}: Props) => {
  const isRtlLanguage = !!book.language.isRTL;

  return (
    <Container size="large" gutter={false}>
      <Backdrop />
      <Card>
        <Toolbar
          book={book}
          chapter={chapterPointer}
          userHasEditAccess={userHasEditAccess}
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
          {loading ? (
            <Layout>
              <CircularProgress />
            </Layout>
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

const Layout = styled('div')`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

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
