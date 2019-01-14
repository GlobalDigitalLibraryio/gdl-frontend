// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Trans } from '@lingui/react';
import { IconButton, Tooltip, Grid } from '@material-ui/core';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  FormatSize as FormatSizeIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@material-ui/icons';

import { logEvent } from '../../lib/analytics';
import type { BookDetails } from '../../types';
import { Link } from '../../routes';
import SrOnly from '../SrOnly';
import { colors } from '../../style/theme';
import media from '../../style/media';
import Favorite, { FavoriteIcon } from '../Favorite';

type Props = {
  book: BookDetails,
  onRequestClose(): void,
  userHasEditAccess?: boolean,
  chapter: { id: number, seqNo: number },
  increaseFontSize(): void,
  decreaseFontSize(): void,
  fontSize: number
};

const Toolbar = ({
  book,
  chapter,
  userHasEditAccess,
  onRequestClose,
  increaseFontSize,
  decreaseFontSize,
  fontSize
}: Props) => (
  <Grid container className={styledGrid}>
    <Grid item style={{ alignSelf: 'flex-end' }}>
      <FontSizeComponent
        fontSize={fontSize}
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
      />
    </Grid>
    <Grid item>
      {/* Create single string for page / of x. Reads better in screen readers. Otherwise each thing is on a new line */}
      <div>{`${chapter.seqNo} / ${book.chapters.length}`}</div>
    </Grid>
    <Grid item>
      <Buttons>
        {userHasEditAccess && (
          <Link
            href={{
              pathname: '/admin/edit/book',
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
    </Grid>
  </Grid>
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
            >
              <FavoriteIcon filled={isFav} />
              <SrOnly>
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

const FontSizeComponent = ({
  fontSize,
  decreaseFontSize,
  increaseFontSize
}: {
  fontSize: number,
  decreaseFontSize(): void,
  increaseFontSize(): void
}) => (
  <FontSizeButtons>
    <IconButton onClick={decreaseFontSize}>
      <RemoveIcon />
    </IconButton>
    <div css={{ marginTop: '15px' }}>
      <FormatSizeIcon />
    </div>
    <IconButton onClick={increaseFontSize}>
      <AddIcon />
    </IconButton>
  </FontSizeButtons>
);

const styledGrid = css`
  z-index: 2;
  top: 0;
  position: relative;
  position: sticky;
  justify-content: space-around;
  align-items: baseline;
  background: #fff;
  color: ${colors.text.subtle};
  border-bottom: 1px solid ${colors.base.grayLight};
  font-size: 14px;
  min-height: 48px;
  ${media.tablet`
    margin-bottom: 50px;
    justify-content: space-between;
  `};
`;

const FontSizeButtons = styled.div`
  width: 100%;
  display: flex;
`;

const Buttons = styled.div`
  right: 0;
`;

export default Toolbar;
