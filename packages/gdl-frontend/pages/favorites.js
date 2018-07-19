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
  Avatar,
  Button,
  Typography,
  CircularProgress
} from '@material-ui/core';
import { FavoriteBorder as FavoriteBorderIcon } from '@material-ui/icons';
import Link from 'next/link';

import { fetchBook } from '../fetch';
import type { Book } from '../types';
import Layout from '../components/Layout';
import Head from '../components/Head';
import { Container, Center } from '../elements';
import { spacing } from '../style/theme';
import { getFavorites } from '../lib/favorites';
import BookGrid from '../components/BookGrid';

type State = {
  books: Array<Book>,
  loadingStatus: 'LOADING' | 'SUCCESS' | 'ERROR'
};

class FavoritesPage extends React.Component<{}, State> {
  state = {
    loadingStatus: 'LOADING',
    books: []
  };

  async componentDidMount() {
    const favs = getFavorites();

    const booksResults = await Promise.all(
      favs.map(fav => fetchBook(fav.id, fav.lang))
    );

    if (booksResults.some(res => !res.isOk)) {
      this.setState({ loadingStatus: 'ERROR' });
    } else {
      const books = booksResults.map(res => res.data);
      this.setState({ books, loadingStatus: 'SUCCESS' });
    }
  }

  render() {
    const { books, loadingStatus } = this.state;
    return (
      <>
        <Head title="Favorites" />
        <Layout>
          <Container>
            <Typography
              variant="headline"
              align="center"
              css={{ marginTop: spacing.large, marginBottom: spacing.large }}
            >
              <Trans>Favorites</Trans>
            </Typography>

            {loadingStatus === 'LOADING' && (
              <Center>
                <CircularProgress />
              </Center>
            )}

            {loadingStatus === 'ERROR' && (
              <Typography>
                <Trans>Unable to load favorites</Trans>
              </Typography>
            )}

            {loadingStatus === 'SUCCESS' && (
              <>
                {books.length > 0 ? (
                  <BookGrid books={books} />
                ) : (
                  <Center>
                    <Avatar css={{ height: 100, width: 100 }}>
                      <FavoriteBorderIcon
                        css={{ color: 'red', fontSize: 70 }}
                      />
                    </Avatar>
                    <Typography
                      align="center"
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
                      <Button variant="outlined">
                        <Trans>Find something to read</Trans>
                      </Button>
                    </Link>
                  </Center>
                )}
              </>
            )}
          </Container>
        </Layout>
      </>
    );
  }
}

export default FavoritesPage;
