// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'react-emotion';
import { Trans } from '@lingui/react';
import { MdClose } from 'react-icons/lib/md';

import type { BookDetails, ChapterSummary } from '../../types';
import { Link } from '../../routes';
import SrOnly from '../SrOnly';
import { colors } from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';

const Div = styled.div`
  z-index: 2;
  position: relative;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  color: ${colors.text.subtle};
  border-bottom: 1px solid ${colors.base.grayLight};
  background: ${colors.base.white};
  ${flexCenter};

  font-size: 14px;
  min-height: 48px;
  margin-bottom: 20px;
  span {
    margin-left: auto;
    margin-right: auto;
  }
  ${media.tablet`
    margin-bottom: 50px;
  `};
`;

const Button = styled.button`
  background: transparent;
  border: none;
  padding: 10px;
  position: absolute;
  right: 0;
  color: ${colors.base.black};
`;

type Props = {
  book: BookDetails,
  onRequestClose(): void,
  userHasEditAccess?: boolean,
  chapter: ChapterSummary
};

// Create single string for page / of x. Reads better in screen readers. Otherwise each thing is on a new line
const Toolbar = ({
  book,
  chapter,
  userHasEditAccess,
  onRequestClose
}: Props) => (
  <Div>
    {userHasEditAccess && (
      <Link route="edit" params={{ lang: book.language.code, id: book.id }}>
        <a>Edit</a>
      </Link>
    )}
    <div>{`${chapter.seqNo} / ${book.chapters.length}`}</div>
    <Button onClick={onRequestClose} type="button">
      <MdClose aria-hidden />{' '}
      <SrOnly>
        <Trans>Close book</Trans>
      </SrOnly>
    </Button>
  </Div>
);

export default Toolbar;
