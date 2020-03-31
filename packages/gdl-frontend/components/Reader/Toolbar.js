// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from '@emotion/styled';
import { FormattedMessage } from 'react-intl';
import { IconButton, Tooltip } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';
import { QueryIsAdmin } from '../../gql';

import { Link } from '../../routes';
import SrOnly from '../SrOnly';
import { colors } from '../../style/theme';
import media from '../../style/media';
import Favorite, { FavoriteIcon } from '../Favorite';
import { flexCenter } from '../../style/flex';

export type Book = $ReadOnly<{
  id: string,
  bookId: number,
  language: { +code: string, isRTL: boolean },
  title: string,
  chapters: $ReadOnlyArray<any>
}>;

type Props = {
  onRequestClose(): void,
  book: Book,
  chapter: $ReadOnly<{ chapterId: number, seqNo: number }>,
  showToolbarIcons?: boolean
};

const Toolbar = ({ book, chapter, onRequestClose, showToolbarIcons=true }: Props) => (
  <Div>
    {/* Create single string for page / of x. Reads better in screen readers. Otherwise each thing is on a new line */}
    <div data-cy="read-book-chapter-index">{`${chapter.seqNo} / ${
      book.chapters.length
    }`}</div>
    <Buttons>
      <QueryIsAdmin>
        {({ isAdmin }) =>
          isAdmin && (
            <Link
              href={{
                pathname: '/admin/edit/book',
                query: {
                  id: book.bookId,
                  lang: book.language.code,
                  chapterId: chapter.chapterId
                }
              }}
            >
              <IconButton title="Edit book">
                <EditIcon />
              </IconButton>
            </Link>
          )
        }
      </QueryIsAdmin>
      {showToolbarIcons && 
      <>
        <FavButton book={book} />
        <IconButton onClick={onRequestClose}>
          <CloseIcon data-cy="read-book-close-button" />
          <SrOnly>
            <FormattedMessage id="Close book" defaultMessage="Close book" />
          </SrOnly>
        </IconButton>
      </>}
    </Buttons>
  </Div>
);

const FavButton = ({ book }: { book: Book }) => (
  <Favorite book={book}>
    {({ isFav, onClick }) => (
      <Tooltip
        // Force remounting of the tooltip when the fav state changes
        key={isFav.toString()}
        title={
          isFav ? (
            <FormattedMessage
              id="Remove from favorites"
              defaultMessage="Remove from favorites"
            />
          ) : (
            <FormattedMessage
              id="Add to favorites"
              defaultMessage="Add to favorites"
            />
          )
        }
      >
        <IconButton onClick={onClick}>
          <FavoriteIcon filled={isFav} data-cy="read-book-favorite-button" />
          <SrOnly>
            {isFav ? (
              <FormattedMessage
                id="Remove from favorites"
                defaultMessage="Remove from favorites"
              />
            ) : (
              <FormattedMessage
                id="Add to favorites"
                defaultMessage="Add to favorites"
              />
            )}
          </SrOnly>
        </IconButton>
      </Tooltip>
    )}
  </Favorite>
);

const Div = styled.div`
  z-index: 2;
  background: #fff;
  position: relative;
  position: sticky;
  top: 0;
  color: ${colors.text.subtle};
  border-bottom: 1px solid ${colors.base.grayLight};
  ${flexCenter};

  font-size: 14px;
  min-height: 48px;
  ${media.tablet`
    margin-bottom: 50px;
  `};
`;

const Buttons = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export default Toolbar;
