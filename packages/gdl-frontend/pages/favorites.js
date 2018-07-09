// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { Avatar, Button, Typography } from '@material-ui/core';
import { FavoriteBorder as FavoriteBorderIcon } from '@material-ui/icons';
import Link from 'next/link';

import { fetchBook } from '../fetch';
import type { Book } from '../types';
import Layout from '../components/Layout';
import Head from '../components/Head';
import { Container } from '../elements';
import { spacing, colors } from '../style/theme';
import { getFavorites } from '../lib/favorites';
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
  }

  render() {
    const books = this.state.books;
    return (
      <>
        <Head title="Favorites" />
        <Layout>
          <Typography
            align="center"
            variant="headline"
            css={{ marginTop: spacing.large, marginBottom: spacing.large }}
          >
            Favorites
          </Typography>
          {books && books.length > 0 && <BookGrid books={books} />}
          {books &&
            books.length === 0 && (
              <div css={{ textAlign: 'center' }}>
                <div
                  css={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: spacing.xlarge
                  }}
                >
                  <Avatar css={{ height: 100, width: 100 }}>
                    <FavoriteBorderIcon css={{ color: 'red', fontSize: 70 }} />
                  </Avatar>
                </div>
                <Typography
                  css={{
                    marginTop: spacing.large,
                    marginBottom: spacing.medium
                  }}
                >
                  <Trans>
                    Add books to your favorites so you can easily find them
                    later.
                  </Trans>
                </Typography>
                <Link passHref href="/">
                  <Button variant="outlined">Find something to read</Button>
                </Link>
              </div>
            )}
        </Layout>
      </>
    );
  }
}

export default FavoritesPage;
