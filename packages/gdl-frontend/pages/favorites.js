// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  Icon
} from '@material-ui/core';
import { Favorite as FavoriteIcon } from '@material-ui/icons';

import { Link } from '../routes';
import { fetchBook } from '../fetch';
import type { Book } from '../types';
import Layout from '../components/Layout';
import Head from '../components/Head';
import { Container } from '../elements';
import { spacing, colors } from '../style/theme';
import { withMuiRoot } from '../hocs';
import { getFavorites, removeAsFavorite } from '../lib/favorites';
import BookGrid from '../components/BookGrid';

type State = {
  books?: Array<Book>
};

class FavoritesPage extends React.Component<{}, State> {
  state = {};

  async componentDidMount() {
    const favs = getFavorites();
    const books = await Promise.all(
      favs.map(fav => fetchBook(fav.id, fav.lang))
    ).then(bookResults => bookResults.map(bookResult => bookResult.data));

    this.setState({ books });

    console.log(books);
  }

  removeFavorite = book => {
    removeAsFavorite(book);
    this.setState(state => ({ books: state.books.filter(b => b !== book) }));
  };

  render() {
    return (
      <>
        <Head title="Favorites" />
        <Layout crumbs={[<Trans>Favorites</Trans>]}>
          <Typography align="center" variant="headline">
            Favorites
          </Typography>
          {this.state.books && <BookGrid books={this.state.books} />}
          {!this.state.books && (
            <div>
              <Typography>
                <Trans>Books you mark as favorites are listed here.</Trans>
              </Typography>
            </div>
          )}
        </Layout>
      </>
    );
  }
}

const Favorite = ({ book, removeFavorite }) => (
  <Card>
    <CardContent>
      <IconButton onClick={() => removeFavorite(book)}>
        <FavoriteIcon />
      </IconButton>
      <Link route={`/${book.language.code}/books/details/${book.id}`} passHref>
        <Typography component="a" lang={book.language.code}>
          {book.title}
        </Typography>
      </Link>
      <Typography lang={book.language.code}>{book.description}</Typography>
    </CardContent>
  </Card>
);

export default withMuiRoot(FavoritesPage);
