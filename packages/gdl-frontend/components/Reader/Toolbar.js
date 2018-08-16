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
import { IconButton, Tooltip } from '@material-ui/core';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteOutlineIcon
} from '@material-ui/icons';

import { logEvent } from '../../lib/analytics';
import type { BookDetails, ChapterSummary } from '../../types';
import { Link } from '../../routes';
import SrOnly from '../SrOnly';
import { colors } from '../../style/theme';
import media from '../../style/media';
import Favorite from '../Favorite';
import { flexCenter } from '../../style/flex';

type Props = {
  book: BookDetails,
  onRequestClose(): void,
  userHasEditAccess?: boolean,
  chapter: ChapterSummary
};

const Toolbar = ({
  book,
  chapter,
  userHasEditAccess,
  onRequestClose
}: Props) => (
  <Div>
    {/* Create single string for page / of x. Reads better in screen readers. Otherwise each thing is on a new line */}
    <div>{`${chapter.seqNo} / ${book.chapters.length}`}</div>
    <Buttons>
      {userHasEditAccess && (
        <Link
          href={{
            pathname: '/admin/edit',
            query: {
              id: book.id,
              lang: book.language.code,
              chapterId: chapter.id
            }
          }}
        >
          <IconButton title="Edit book">
            <EditIcon />
          </IconButton>
        </Link>
      )}
      <FavButton book={book} />
      <IconButton onClick={onRequestClose}>
        <CloseIcon />
        <SrOnly>
          <Trans>Close book</Trans>
        </SrOnly>
      </IconButton>
    </Buttons>
  </Div>
);

class FavButton extends React.Component<{ book: BookDetails }> {
  render() {
    return (
      <Favorite
        id={this.props.book.id}
        language={this.props.book.language.code}
      >
        {({ isFav, onClick }) => (
          <Tooltip
            // Force remounting of the tooltip when the fav state changes
            key={isFav.toString()}
            title={
              isFav ? (
                <Trans>Remove from favorites</Trans>
              ) : (
                <Trans>Add to favorites</Trans>
              )
            }
          >
            <IconButton
              onClick={() => {
                onClick();
                logEvent(
                  'Books',
                  isFav ? 'Unfavorited' : 'Favorited',
                  this.props.book.title
                );
              }}
              style={isFav ? { color: 'red' } : null}
            >
              {isFav ? <FavoriteIcon /> : <FavoriteOutlineIcon />}
              <SrOnly>
                <Trans>Mark book as favorite</Trans>
                {isFav ? (
                  <Trans>Remove from favorites</Trans>
                ) : (
                  <Trans>Add to favorites</Trans>
                )}
              </SrOnly>
            </IconButton>
          </Tooltip>
        )}
      </Favorite>
    );
  }
}

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
