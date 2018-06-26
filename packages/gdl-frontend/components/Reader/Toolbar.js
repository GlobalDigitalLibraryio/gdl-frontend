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
import { IconButton } from '@material-ui/core';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteOutlineIcon
} from '@material-ui/icons';

import type { BookDetails, ChapterSummary } from '../../types';
import { Link } from '../../routes';
import SrOnly from '../SrOnly';
import { colors } from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';
import {
  markAsFavorite,
  removeAsFavorite,
  isFavorite
} from '../../lib/favorites';

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
  span {
    margin-left: auto;
    margin-right: auto;
  }
  ${media.tablet`
    margin-bottom: 50px;
  `};
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
    <div>{`${chapter.seqNo} / ${book.chapters.length}`}</div>
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
        <IconButton
          title="Edit book"
          css={{ position: 'absolute', right: '50px' }}
        >
          <EditIcon />
        </IconButton>
      </Link>
    )}
    <FavButton book={book} />
    <IconButton
      onClick={onRequestClose}
      css={{ position: 'absolute', right: '0' }}
    >
      <CloseIcon />
      <SrOnly>
        <Trans>Close book</Trans>
      </SrOnly>
    </IconButton>
  </Div>
);

class FavButton extends React.Component {
  state = {
    client: false
  };

  componentDidMount() {
    this.setState({ client: true, isFav: isFavorite(this.props.book) });
  }

  handleFav = () => {
    this.state.isFav
      ? removeAsFavorite(this.props.book)
      : markAsFavorite(this.props.book);

    this.setState({ isFav: isFavorite(this.props.book) });
  };

  render() {
    if (!this.state.client) return null;
    const isFav = this.state.isFav;
    return (
      <IconButton
        onClick={this.handleFav}
        css={`
          position: absolute;
          right: 50px;
        `}
        style={isFav ? { color: 'red' } : null}
      >
        {isFav ? <FavoriteIcon /> : <FavoriteOutlineIcon />}
        <SrOnly>
          <Trans>Mark book as favorite</Trans>
        </SrOnly>
      </IconButton>
    );
  }
}

export default Toolbar;
