// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { markAsFavorite, removeAsFavorite, isFavorite } from '../lib/favorites';

type Props = {
  id: number,
  language: string,
  children: (data: { isFav: boolean, onClick: () => void }) => React.Node
};

export default class Favorite extends React.Component<
  Props,
  { isFav: boolean }
> {
  state = {
    isFav: false
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.id !== this.props.id ||
      prevProps.language !== this.props.language
    ) {
      this.updateFavState();
    }
  }

  componentDidMount() {
    this.updateFavState();
  }

  updateFavState = () => {
    const isFav = isFavorite({
      id: this.props.id,
      language: this.props.language
    });

    if (isFav !== this.state.isFav) {
      this.setState({ isFav });
    }
  };

  handleClick = () => {
    const fav = { id: this.props.id, language: this.props.language };

    this.state.isFav ? removeAsFavorite(fav) : markAsFavorite(fav);

    this.setState(state => ({ isFav: !this.state.isFav }));
  };

  render() {
    return this.props.children({
      isFav: this.state.isFav,
      onClick: this.handleClick
    });
  }
}
