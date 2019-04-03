// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { addFavorite, removeFavorite, isFavorite } from '../../lib/favorites';
import { logEvent } from '../../lib/analytics';

type Props = {
  children: (data: { isFav: boolean, onClick: () => void }) => React.Node,
  book: $ReadOnly<{
    id: string,
    title: string
  }>
};

export default class Favorite extends React.Component<
  Props,
  { favorited: boolean }
> {
  state = {
    favorited: false
  };

  componentDidMount() {
    this.setState({ favorited: isFavorite(this.props.book.id) });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.book.id !== this.props.book.id) {
      this.setState({ favorited: isFavorite(this.props.book.id) });
    }
  }

  handleFavorite = () => {
    addFavorite(this.props.book.id);
    this.setState({ favorited: true });
    logEvent('Books', 'Favorited', this.props.book.title);
  };

  handleUnfavorite = () => {
    removeFavorite(this.props.book.id);
    this.setState({ favorited: false });
    logEvent('Books', 'Unfavorited', this.props.book.title);
  };

  render() {
    const { favorited } = this.state;
    return this.props.children({
      isFav: favorited,
      onClick: favorited ? this.handleUnfavorite : this.handleFavorite
    });
  }
}
